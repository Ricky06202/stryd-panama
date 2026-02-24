import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const userId = url.searchParams.get('state') // We pass userId in the state

  const STRAVA_CLIENT_ID = locals.runtime.env.STRAVA_CLIENT_ID
  const STRAVA_CLIENT_SECRET = locals.runtime.env.STRAVA_CLIENT_SECRET

  if (!code || !userId) {
    return new Response(JSON.stringify({ error: 'Missing code or state' }), {
      status: 400,
    })
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to exchange token' }),
        { status: 500 },
      )
    }

    const data = (await response.json()) as any
    const db = getDb(locals.runtime.env.DB)

    await db
      .update(users)
      .set({
        stravaAthleteId: data.athlete.id,
        stravaAccessToken: data.access_token,
        stravaRefreshToken: data.refresh_token,
        stravaExpiresAt: data.expires_at,
      })
      .where(eq(users.id, parseInt(userId)))

    // Redirect back to StrydBoard
    return Response.redirect(`${url.origin}/strydboard?strava=connected`, 302)
  } catch (error) {
    console.error('OAuth Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
