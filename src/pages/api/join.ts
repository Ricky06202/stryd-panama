import type { APIRoute } from 'astro'
import { getDb } from '../../db/client'
import { users, membershipRequests } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const data = await request.json()

    // 1. Crear el usuario
    const newUser = await db
      .insert(users)
      .values({
        fullName: data.fullName,
        email: data.email,
        idCard: data.idCard,
        phone: data.phone,
        password: data.password, // TODO: Hash password in production
        gender: data.gender,
        weight: data.weight,
        height: data.height,
        birthDate: data.birthDate,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        isMember: data.isAlreadyMember === true,
        // Records si existen
        record5k: data.record5k,
        record10k: data.record10k,
        record21k: data.record21k,
        record42k: data.record42k,
        recordWkg: data.recordWkg,
        photoUrl: data.photoUrl,
      })
      .returning()
      .get()

    // 2. Si no es miembro, crear solicitud de membresía
    if (data.isAlreadyMember === false) {
      await db
        .insert(membershipRequests)
        .values({
          userId: newUser.id,
          goals: data.goals,
          selectedPlan: data.selectedPlan,
          status: 'pending',
        })
        .run()
    }

    return new Response(JSON.stringify({ message: 'Registro completado con éxito', userId: newUser.id }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error in api/join:', error)
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
