import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users, membershipRequests } from '../../../db/schema'
import { desc, eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)

    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    })

    const athletes = allUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      stravaConnected: !!user.stravaRefreshToken,
    }))

    return new Response(JSON.stringify({ athletes }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Admin Athletes Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const { id } = (await request.json()) as { id: number }

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
      })
    }

    // Borrado manual de registros relacionados si no hay cascade
    // En este caso, borramos la solicitud de membresía primero
    await db
      .delete(membershipRequests)
      .where(eq(membershipRequests.userId, id))
      .run()

    // Luego el usuario
    await db.delete(users).where(eq(users.id, id)).run()

    return new Response(
      JSON.stringify({ message: 'Atleta eliminado con éxito' }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Delete Athlete Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

export const PATCH: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const { id, ...data } = (await request.json()) as any

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
      })
    }

    // Solo permitimos editar ciertos campos básicos por ahora
    const allowedFields = ['fullName', 'email', 'phone', 'idCard']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid fields to update' }),
        { status: 400 },
      )
    }

    await db.update(users).set(updateData).where(eq(users.id, id)).run()

    return new Response(
      JSON.stringify({ message: 'Atleta actualizado con éxito' }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Update Athlete Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
