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

  const data = (await request.json()) as any

  // Get current event to check for existing gpxUrl
  const currentEvent = await db
    .select()
    .from(events)
    .where(eq(events.id, Number(id)))
    .get()

  if (!currentEvent) return new Response('Not found', { status: 404 })

  // If gpxUrl is being updated and there was a previous one, delete the old one from R2
  if (
    data.gpxUrl !== undefined &&
    currentEvent.gpxUrl &&
    data.gpxUrl !== currentEvent.gpxUrl
  ) {
    const bucket = locals.runtime.env.strydpanama_bucket
    if (bucket) {
      try {
        await bucket.delete(currentEvent.gpxUrl)
      } catch (err) {
        console.error('Error deleting old file from R2:', err)
      }
    }
  }

  if (data.date) {
    try {
      data.date = new Date(data.date)
      if (isNaN(data.date.getTime())) throw new Error('Invalid date')
    } catch (e) {
      console.error('Error parsing date:', data.date)
      return new Response(
        JSON.stringify({ error: 'Formato de fecha inválido' }),
        { status: 400 },
      )
    }
  }

  try {
    const updated = (await db
      .update(events)
      .set(data)
      .where(eq(events.id, Number(id)))
      .returning()) as any

    if (!updated || updated.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No se pudo actualizar el evento' }),
        { status: 404 },
      )
    }

    return new Response(JSON.stringify(updated[0]), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Error updating event:', err)
    return new Response(
      JSON.stringify({
        error:
          'Error en la base de datos: ' + (err.message || 'Error desconocido'),
      }),
      { status: 500 },
    )
  }
}

export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  // Get event to check for gpxUrl before deleting
  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, Number(id)))
    .get()

  if (event?.gpxUrl) {
    const bucket = locals.runtime.env.strydpanama_bucket
    if (bucket) {
      try {
        await bucket.delete(event.gpxUrl)
      } catch (err) {
        console.error('Error deleting file from R2 on event delete:', err)
      }
    }
  }

  await db.delete(events).where(eq(events.id, Number(id)))
  return new Response(null, { status: 204 })
}
