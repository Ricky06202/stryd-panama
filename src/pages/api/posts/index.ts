import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client' // Adjust path
import { posts } from '../../../db/schema' // Adjust path
import { eq, desc } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .all()
  return new Response(JSON.stringify(allPosts), {
    headers: { 'content-type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDb(locals.runtime.env.DB)
  const data = (await request.json()) as any

  // Auto-generate slug if not provided
  if (!data.slug && data.title) {
    data.slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // TODO: Validate data
  const newPost = (await db.insert(posts).values(data).returning()) as any
  return new Response(JSON.stringify(newPost), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  })
}
