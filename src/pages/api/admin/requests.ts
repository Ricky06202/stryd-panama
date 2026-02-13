import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users, membershipRequests } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const { requestId, action } = await request.json()

    if (!requestId || !['approve', 'reject'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), {
        status: 400,
      })
    }

    const reqs = await db
      .select()
      .from(membershipRequests)
      .where(eq(membershipRequests.id, requestId))
      .limit(1)
      .all()

    const req = reqs[0]

    if (!req) {
      return new Response(JSON.stringify({ error: 'Solicitud no encontrada' }), {
        status: 404,
      })
    }

    if (action === 'approve') {
      // 1. Marcar usuario como miembro
      await db
        .update(users)
        .set({ isMember: true })
        .where(eq(users.id, req.userId))
        .run()

      // 2. Actualizar estado de la solicitud
      await db
        .update(membershipRequests)
        .set({ status: 'approved' })
        .where(eq(membershipRequests.id, requestId))
        .run()
    } else {
      // Rechazar solicitud
      await db
        .update(membershipRequests)
        .set({ status: 'rejected' })
        .where(eq(membershipRequests.id, requestId))
        .run()
    }

    return new Response(
      JSON.stringify({ message: `Solicitud ${action === 'approve' ? 'aprobada' : 'rechazada'} con éxito` }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in admin/requests:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
    })
  }
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const requests = await db
      .select({
        id: membershipRequests.id,
        status: membershipRequests.status,
        createdAt: membershipRequests.createdAt,
        user: {
          fullName: users.fullName,
          email: users.email,
          idCard: users.idCard,
        }
      })
      .from(membershipRequests)
      .innerJoin(users, eq(membershipRequests.userId, users.id))
      .where(eq(membershipRequests.status, 'pending'))
      .all()

    return new Response(JSON.stringify(requests), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener solicitudes' }), {
      status: 500,
    })
  }
}
