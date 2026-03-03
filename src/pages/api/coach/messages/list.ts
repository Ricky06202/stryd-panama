import type { APIRoute } from 'astro'
import { getDb } from '../../../../db/client'
import { coachMessages } from '../../../../db/schema'
import { eq, desc } from 'drizzle-orm'

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const url = new URL(request.url)
    const userId = parseInt(url.searchParams.get('userId') || '')

    if (isNaN(userId)) {
      return new Response(
        JSON.stringify({ error: 'Valid User ID is required' }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      )
    }

    const messages = await db
      .select()
      .from(coachMessages)
      .where(eq(coachMessages.userId, userId))
      .orderBy(desc(coachMessages.createdAt))
      .all()

    return new Response(
      JSON.stringify({
        coachMessages: messages,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  } catch (error: any) {
    console.error('Error in api/coach/messages/list:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }
}
