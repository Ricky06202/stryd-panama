import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users, ftpHistory } from '../../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAthleteFullHistory } from '../../../lib/strava'
import {
  calculateTSS,
  calculatePerformanceTimeSeries,
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

    // 1. Get user and their latest FTP
    const [user, latestFtp] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, id) }),
      db.query.ftpHistory.findFirst({
        where: eq(ftpHistory.userId, id),
        orderBy: [desc(ftpHistory.date)],
      }),
    ])

    if (!user || !user.stravaRefreshToken) {
      return new Response(JSON.stringify({ error: 'Strava not connected' }), {
        status: 404,
      })
    }

    // 2. Fetch last 365 days of activities
    const rawActivities = await getAthleteFullHistory(
      db,
      id,
      STRAVA_CLIENT_ID,
      STRAVA_CLIENT_SECRET,
    )

    // 3. Process activities to get TSS
    const ftp = latestFtp?.ftp || 200 // Default if no history
    const activitiesWithTSS = rawActivities.map((a: any) => ({
      date: a.start_date.split('T')[0],
      tss: calculateTSS(a, ftp),
    }))

    // 4. Calculate Time Series
    const metrics = calculatePerformanceTimeSeries(activitiesWithTSS, 90) // Last 90 days for the chart

    return new Response(JSON.stringify({ metrics, ftp }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Metrics Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
