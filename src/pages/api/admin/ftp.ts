import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { ftpHistory } from '../../../db/schema'
import { eq, and } from 'drizzle-orm'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const body: { userId: string; ftp: string; date: string } =
      await request.json()
    const { userId, ftp, date } = body

    if (!userId || !ftp || !date) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), {
        status: 400,
      })
    }

    // Insertar nuevo registro de FTP
    await db.insert(ftpHistory).values({
      userId: parseInt(userId),
      ftp: parseInt(ftp),
      date,
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error adding FTP:', error)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
    })
  }
}

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const body: { id: string } = await request.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Falta ID' }), {
        status: 400,
      })
    }

    await db.delete(ftpHistory).where(eq(ftpHistory.id, parseInt(id)))

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting FTP:', error)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
    })
  }
}
