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
      photoUrl,
      startDate,
    } = data

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Manejo de borrado de imagen anterior para evitar huérfanos
    if (photoUrl) {
      const currentUser = await db
        .select({ photoUrl: users.photoUrl })
        .from(users)
        .where(eq(users.id, userId))
        .get()

      if (currentUser?.photoUrl && currentUser.photoUrl !== photoUrl) {
        const bucket = locals.runtime.env.strydpanama_bucket
        if (bucket) {
          try {
            await bucket.delete(currentUser.photoUrl)
            console.log(`Deleted old profile photo: ${currentUser.photoUrl}`)
          } catch (deleteError) {
            console.error('Error deleting old photo from R2:', deleteError)
          }
        }
      }
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
        photoUrl,
        startDate,
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
