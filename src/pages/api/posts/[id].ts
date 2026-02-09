import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { posts } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get()

  if (!post) return new Response('Not found', { status: 404 })

  return new Response(JSON.stringify(post), {
    headers: { 'content-type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  const data = await request.json()
  const updated = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, Number(id)))
    .returning()

  return new Response(JSON.stringify(updated[0]), {
    headers: { 'content-type': 'application/json' },
  })
}

export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  await db.delete(posts).where(eq(posts.id, Number(id)))
  return new Response(null, { status: 204 })
}
