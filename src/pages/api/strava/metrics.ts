import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users, ftpHistory } from '../../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAthleteFullHistory } from '../../../lib/strava'
import {
  calculateTSS,
  calculatePerformanceTimeSeries,
  calculateRSS,
} from '../../../lib/performance'

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
    })
  }

  try {
    const db = getDb(locals.runtime.env.DB)
    const id = parseInt(userId)

    const STRAVA_CLIENT_ID = locals.runtime.env.STRAVA_CLIENT_ID as string
    const STRAVA_CLIENT_SECRET = locals.runtime.env
      .STRAVA_CLIENT_SECRET as string

    // 1. Get user and their FTP history
    const [user, ftpRecords] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, id) }),
      db.query.ftpHistory.findMany({
        where: eq(ftpHistory.userId, id),
        orderBy: [desc(ftpHistory.date)],
      }),
    ])

    if (!user || !user.stravaRefreshToken) {
      return new Response(JSON.stringify({ error: 'Strava not connected' }), {
        status: 404,
      })
    }

    // Default FTP if no history
    const defaultFtp = user.strydUser ? 250 : 200

    // 2. Fetch last 365 days of activities
    const rawActivities = await getAthleteFullHistory(
      db,
      id,
      STRAVA_CLIENT_ID,
      STRAVA_CLIENT_SECRET,
    )

    // Helper to find the active FTP for a given date
    const getFtpForDate = (date: string) => {
      // ftpRecords is sorted by date DESC
      const activeRecord = ftpRecords.find((r: any) => r.date <= date)
      return activeRecord?.ftp || defaultFtp
    }

    // 3. Process activities to get TSS using historical FTP
    const activitiesWithTSS = rawActivities.map((a: any) => {
      const date = (a.start_date_local || a.start_date).split('T')[0]
      const ftpAtTime = getFtpForDate(date)
      return {
        date,
        tss: calculateTSS(a, ftpAtTime),
      }
    })

    // 4. Calculate Time Series and Stats
    const metricsRaw = calculatePerformanceTimeSeries(activitiesWithTSS, 90) // Last 90 days

    // Add current FTP to metrics for the chart
    const metrics = metricsRaw.map((m) => ({
      ...m,
      ftp: getFtpForDate(m.date),
    }))

    const rss = calculateRSS(activitiesWithTSS, 7)

    // New detailed statistics
    const getPanamaDate = (date: Date = new Date()) => {
      return new Date(
        date.toLocaleString('en-US', { timeZone: 'America/Panama' }),
      )
    }

    const todayPanama = getPanamaDate()
    const currentYear = todayPanama.getFullYear()
    const currentMonth = todayPanama.getMonth()

    // Weekly stats (last 7 days)
    const sevenDaysAgo = new Date(todayPanama)
    sevenDaysAgo.setDate(todayPanama.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

    const weeklyActivities = rawActivities.filter((a: any) => {
      const date = (a.start_date_local || a.start_date).split('T')[0]
      return date >= sevenDaysAgoStr
    })

    const weekKm = Math.round(
      weeklyActivities.reduce((acc, a) => acc + (a.distance || 0), 0) / 1000,
    )
    const weekDays = new Set(
      weeklyActivities.map(
        (a) => (a.start_date_local || a.start_date).split('T')[0],
      ),
    ).size

    // Monthly stats (current calendar month)
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthStartStr = monthStart.toISOString().split('T')[0]

    const monthlyActivities = rawActivities.filter((a: any) => {
      const date = (a.start_date_local || a.start_date).split('T')[0]
      return date >= monthStartStr
    })

    const monthKm = Math.round(
      monthlyActivities.reduce((acc, a) => acc + (a.distance || 0), 0) / 1000,
    )

    // Yearly stats (calendar year)
    const yearStart = new Date(currentYear, 0, 1)
    const yearStartStr = yearStart.toISOString().split('T')[0]

    const yearlyActivities = rawActivities.filter((a: any) => {
      const date = (a.start_date_local || a.start_date).split('T')[0]
      return date >= yearStartStr
    })

    const yearKm = Math.round(
      yearlyActivities.reduce((acc, a) => acc + (a.distance || 0), 0) / 1000,
    )

    // Yearly training days (last 365 days or just this year?)
    // The user said "días entrenados del año", usually means calendar year.
    const yearDays = new Set(
      yearlyActivities.map(
        (a) => (a.start_date_local || a.start_date).split('T')[0],
      ),
    ).size

    // Get current state (last element of metrics)
    const current = metrics[metrics.length - 1] || {
      ctl: 0,
      atl: 0,
      tsb: 0,
      ftp: defaultFtp,
    }

    return new Response(
      JSON.stringify({
        metrics,
        ftp: current.ftp,
        ftpHistory: ftpRecords,
        rss,
        ctl: current.ctl,
        atl: current.atl,
        tsb: current.tsb,
        // Added stats
        weekKm,
        weekDays,
        monthKm,
        yearKm,
        yearDays,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Metrics Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
