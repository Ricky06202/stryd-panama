import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { events } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, Number(id)))
    .get()

  if (!event) return new Response('Not found', { status: 404 })

  return new Response(JSON.stringify(event), {
    headers: { 'content-type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  const data = await request.json()

  if (typeof data.date === 'string') {
    data.date = new Date(data.date)
  }

  const updated = await db
    .update(events)
    .set(data)
    .where(eq(events.id, Number(id)))
    .returning()

  return new Response(JSON.stringify(updated[0]), {
    headers: { 'content-type': 'application/json' },
  })
}

export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  await db.delete(events).where(eq(events.id, Number(id)))
  return new Response(null, { status: 204 })
}
