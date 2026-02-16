import type { APIRoute } from 'astro'
import { getDb } from '../../db/client'
import { users, membershipRequests } from '../../db/schema'
import { eq, sql } from 'drizzle-orm'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB)
    const formData = await request.formData()

    // Obtener datos básicos
    const isAlreadyMember = formData.get('isAlreadyMember') === 'true'
    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string

    // Manejo de la foto en R2
    const photoFile = formData.get('photo') as File
    let photoUrl = null

    if (photoFile && photoFile.size > 0) {
      const bucket = locals.runtime.env.strydpanama_bucket
      if (!bucket) {
        throw new Error('R2 bucket binding not found')
      }
      const fileExtension = photoFile.name.split('.').pop()
      const fileName = `profiles/${Date.now()}-${fullName.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`

      const arrayBuffer = await photoFile.arrayBuffer()

      // Subir a R2
      await bucket.put(fileName, arrayBuffer, {
        httpMetadata: { contentType: photoFile.type },
      })

      // Generar URL usando el endpoint de archivos existente
      photoUrl = `/api/files/${fileName}`
    }

    // 1. Verificar si el usuario ya existe (por email o cédula)
    const idCard = formData.get('idCard') as string
    const existingUser = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email} OR ${users.idCard} = ${idCard}`)
      .get()

    if (existingUser) {
      const field =
        existingUser.email === email ? 'El correo electrónico' : 'La cédula'
      return new Response(
        JSON.stringify({
          error: `${field} ya está registrado en nuestro sistema.`,
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        },
      )
    }

    // 2. Crear el usuario en D1
    const newUser = await db
      .insert(users)
      .values({
        fullName: fullName,
        email: email,
        idCard: formData.get('idCard') as string,
        phone: formData.get('phone') as string,
        password: formData.get('password') as string,
        gender: formData.get('gender') as string,
        province: formData.get('province') as string,
        bloodType: formData.get('bloodType') as string,
        allergies: formData.get('allergies') as string,
        diseases: formData.get('illnessHistory') as string,
        pastInjuries: formData.get('pastInjuries') as string,
        currentInjuries: formData.get('currentInjuries') as string,
        weight: formData.get('weight') ? Number(formData.get('weight')) : null,
        height: formData.get('height') ? Number(formData.get('height')) : null,
        fatPercentage: formData.get('fatPercentage')
          ? Number(formData.get('fatPercentage'))
          : null,
        footwearType: formData.get('footwearType') as string,
        birthDate: formData.get('birthDate') as string,
        isMember: false, // Siempre falso inicialmente, requiere aprobación
        photoUrl: photoUrl,
        // Los records ya no se recogen en el registro, se llenan en el perfil
      })
      .returning()
      .get()

    // 2. Crear solicitud de membresía (TODOS pasan por aquí ahora)
    await db
      .insert(membershipRequests)
      .values({
        userId: newUser.id,
        trainingGoals: JSON.stringify(formData.getAll('goals')),
        shortTermGoal: formData.get('shortTermGoals') as string,
        mediumTermGoal: formData.get('midTermGoals') as string,
        longTermGoal: formData.get('longTermGoals') as string,
        trainingDaysPerWeek: formData.get('trainingDays') as string,
        hasTrainedWithStryd: formData.get('hasTrainedWithStryd') as string,
        hasStructuredTraining: formData.get('hasStructuredTraining') as string,
        discoveryMethod: formData.get('discoveryMethod') as string,
        isAlreadyMember: isAlreadyMember,
        status: 'pending',
      })
      .run()

    return new Response(
      JSON.stringify({
        message: 'Registro completado con éxito',
        userId: newUser.id,
        photoUrl: photoUrl,
      }),
      {
        status: 201,
        headers: { 'content-type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Error in api/join:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    )
  }
}
