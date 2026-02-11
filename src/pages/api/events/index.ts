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
  const data = (await request.json()) as any

  // Ensure date is a Date object if coming as string
  if (data.date) {
    try {
      data.date = new Date(data.date)
      if (isNaN(data.date.getTime())) throw new Error('Invalid date')
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Formato de fecha inválido' }),
        { status: 400 },
      )
    }
  } else {
    return new Response(JSON.stringify({ error: 'La fecha es obligatoria' }), {
      status: 400,
    })
  }

  const newEvent = (await db.insert(events).values(data).returning()) as any
  return new Response(JSON.stringify(newEvent[0]), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  })
}
