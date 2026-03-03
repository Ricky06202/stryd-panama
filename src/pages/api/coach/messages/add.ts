import type { APIRoute } from 'astro'
import { getDb } from '../../../../db/client'
import { coachMessages } from '../../../../db/schema'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const { userId, content } = (await request.json()) as {
      userId: number
      content: string
    }

    if (!userId || !content) {
      return new Response(
        JSON.stringify({ error: 'User ID and content are required' }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      )
    }

    const [newMessage] = await db
      .insert(coachMessages)
      .values({
        userId,
        content,
      })
      .returning()

    return new Response(
      JSON.stringify({
        message: 'Mensaje del coach agregado con éxito',
        coachMessage: newMessage,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  } catch (error: any) {
    console.error('Error in api/coach/messages/add:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }
}
