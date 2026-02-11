import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { gallery } from '../../../db/schema'
import { desc, asc } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals.runtime.env.DB)

  const items = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.displayOrder), desc(gallery.createdAt))
    .all()

  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const data = (await request.json()) as any

  const newItem = await db.insert(gallery).values(data).returning()

  return new Response(JSON.stringify(newItem[0]), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  })
}
