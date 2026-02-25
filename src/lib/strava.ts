import { eq } from 'drizzle-orm'
import { users } from '../db/schema'

export async function refreshStravaToken(
  db: any,
  userId: number,
  clientId: string,
  clientSecret: string,
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user || !user.stravaRefreshToken) {
    throw new Error('No Strava refresh token found for user')
  }

  // Check if token is expired (with 1 min buffer)
  if (
    user.stravaExpiresAt &&
    user.stravaExpiresAt > Math.floor(Date.now() / 1000) + 60
  ) {
    return user.stravaAccessToken
  }

  console.log(`Refreshing Strava token for user ${userId}...`)

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: user.stravaRefreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh Strava token: ${response.statusText}`)
  }

  const data = (await response.json()) as {
    access_token: string
    refresh_token: string
    expires_at: number
  }

  await db
    .update(users)
    .set({
      stravaAccessToken: data.access_token,
      stravaRefreshToken: data.refresh_token,
      stravaExpiresAt: data.expires_at,
    })
    .where(eq(users.id, userId))

  return data.access_token
}

export async function fetchStravaActivities(
  accessToken: string,
  before?: number,
  after?: number,
  page: number = 1,
) {
  let url = `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`
  if (before) url += `&before=${before}`
  if (after) url += `&after=${after}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Strava activities: ${response.statusText}`)
  }

  return (await response.json()) as any[]
}

export async function getAthleteFullHistory(
  db: any,
  userId: number,
  clientId: string,
  clientSecret: string,
) {
  const accessToken = await refreshStravaToken(
    db,
    userId,
    clientId,
    clientSecret,
  )

  const now = Math.floor(Date.now() / 1000)
  const oneYearAgo = now - 365 * 24 * 60 * 60

  let allActivities: any[] = []
  let hasMore = true
  let page = 1

  // Fetch up to 1000 activities (5 pages) or until no more are found
  while (hasMore && page <= 5) {
    const activities = await fetchStravaActivities(
      accessToken,
      undefined,
      oneYearAgo,
      page,
    )

    if (activities.length === 0) {
      hasMore = false
    } else {
      allActivities = [...allActivities, ...activities]
      if (activities.length < 200) {
        hasMore = false
      } else {
        page++
      }
    }
  }

  return allActivities
}
