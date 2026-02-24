import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users } from '../../../db/schema'
import { desc } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)

    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    })

    const athletes = allUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      stravaConnected: !!user.stravaRefreshToken,
    }))

    return new Response(JSON.stringify({ athletes }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Admin Athletes Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
