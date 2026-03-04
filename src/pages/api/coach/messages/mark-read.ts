import type { APIRoute } from 'astro'
import { getDb } from '../../../../db/client'
import { coachMessages } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const { messageId } = (await request.json()) as { messageId: number }

    if (!messageId) {
      return new Response(JSON.stringify({ error: 'Message ID is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    await db
      .update(coachMessages)
      .set({ isRead: true })
      .where(eq(coachMessages.id, messageId))
      .run()

    return new Response(
      JSON.stringify({ message: 'Mensaje marcado como leído' }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  } catch (error: any) {
    console.error('Error in api/coach/messages/mark-read:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }
}
