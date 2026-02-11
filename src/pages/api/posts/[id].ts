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

  const data = (await request.json()) as any

  // Get current post to check for existing image
  const currentPost = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get()

  if (!currentPost) return new Response('Not found', { status: 404 })

  // If image is being updated and there was a previous one, delete the old one from R2
  // Check if it's an R2 key (not a full URL or empty)
  if (
    data.image !== undefined &&
    currentPost.image &&
    data.image !== currentPost.image &&
    !currentPost.image.startsWith('http')
  ) {
    const bucket = locals.runtime.env.strydpanama_bucket
    if (bucket) {
      try {
        await bucket.delete(currentPost.image)
      } catch (err) {
        console.error('Error deleting old image from R2:', err)
      }
    }
  }

  const updated = (await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, Number(id)))
    .returning()) as any

  return new Response(JSON.stringify(updated[0]), {
    headers: { 'content-type': 'application/json' },
  })
}

export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const { id } = params
  if (!id) return new Response('ID required', { status: 400 })

  // Get post to check for image before deleting
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get()

  if (post?.image && !post.image.startsWith('http')) {
    const bucket = locals.runtime.env.strydpanama_bucket
    if (bucket) {
      try {
        await bucket.delete(post.image)
      } catch (err) {
        console.error('Error deleting image from R2 on post delete:', err)
      }
    }
  }

  await db.delete(posts).where(eq(posts.id, Number(id)))
  return new Response(null, { status: 204 })
}
