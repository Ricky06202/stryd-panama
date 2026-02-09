import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { events } from '../../../db/schema'

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const allEvents = await db.select().from(events).all()
  return new Response(JSON.stringify(allEvents), {
    headers: { 'content-type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const data = await request.json()

  // Ensure date is a Date object if coming as string
  if (typeof data.date === 'string') {
    data.date = new Date(data.date)
  }

  const newEvent = await db.insert(events).values(data).returning()
  return new Response(JSON.stringify(newEvent[0]), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  })
}
