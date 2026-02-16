import type { APIRoute } from 'astro'
import { getDb } from '../../../db/client'
import { users } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const data = (await request.json()) as any

    // En una implementación real, aquí verificaríamos la sesión del usuario
    // Por ahora, como es un MVP/prototipo y no hay un sistema de auth completo visible en los logs anteriores
    // usaremos el email o ID que venga en el body (o asumiremos un usuario de prueba si es necesario para el demo)
    // Pero lo ideal es usar el ID del usuario autenticado.

    const {
      userId,
      fullName,
      idCard,
      phone,
      bloodType,
      allergies,
      currentInjuries,
      height,
      weight,
      fatPercentage,
      footwearType,
      record5k,
      record10k,
      record21k,
      record42k,
      recordWkg,
      strydUser,
      finalSurgeUser,
    } = data

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    await db
      .update(users)
      .set({
        fullName,
        idCard,
        phone,
        bloodType,
        allergies,
        currentInjuries,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        fatPercentage: fatPercentage ? Number(fatPercentage) : null,
        footwearType,
        record5k,
        record10k,
        record21k,
        record42k,
        recordWkg,
        strydUser,
        finalSurgeUser,
      })
      .where(eq(users.id, userId))
      .run()

    return new Response(
      JSON.stringify({ message: 'Perfil actualizado con éxito' }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Error in api/profile/update:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    )
  }
}
