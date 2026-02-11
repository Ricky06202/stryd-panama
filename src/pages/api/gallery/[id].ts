import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { gallery } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  const item = await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, Number(id)))
    .get()

  if (!item) return new Response('Not found', { status: 404 })

  return new Response(JSON.stringify(item), {
    headers: { 'content-type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  const data = (await request.json()) as any

  // Get current item to check for existing image
  const currentItem = await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, Number(id)))
    .get()

  if (!currentItem) return new Response('Not found', { status: 404 })

  // If imageUrl is being updated and there was a previous one, delete the old one from R2
  if (
    data.imageUrl !== undefined &&
    currentItem.imageUrl &&
    data.imageUrl !== currentItem.imageUrl &&
    !currentItem.imageUrl.startsWith('http')
  ) {
    const bucket = locals.runtime.env.strydpanama_bucket
    if (bucket) {
      try {
        await bucket.delete(currentItem.imageUrl)
      } catch (err) {
        console.error('Error deleting old gallery image from R2:', err)
      }
    }
  }

  const updated = (await db
    .update(gallery)
    .set(data)
    .where(eq(gallery.id, Number(id)))
    .returning()) as any

  return new Response(JSON.stringify(updated[0]), {
    headers: { 'content-type': 'application/json' },
  })
}

export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  // Get item to check for image before deleting
  const item = await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, Number(id)))
    .get()

  if (item?.imageUrl && !item.imageUrl.startsWith('http')) {
    const bucket = locals.runtime.env.strydpanama_bucket
    if (bucket) {
      try {
        await bucket.delete(item.imageUrl)
      } catch (err) {
        console.error('Error deleting gallery image from R2 on delete:', err)
      }
    }
  }

  await db.delete(gallery).where(eq(gallery.id, Number(id)))
  return new Response(null, { status: 204 })
}
