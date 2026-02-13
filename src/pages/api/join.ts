import type { APIRoute } from 'astro'
import { getDb } from '../../db/client'
import { users, membershipRequests } from '../../db/schema'
import { eq } from 'drizzle-orm'

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
        httpMetadata: { contentType: photoFile.type }
      })
      
      // Generar URL usando el endpoint de archivos existente
      photoUrl = `/api/files/${fileName}`
    }

    // 1. Crear el usuario en D1
    const newUser = await db
      .insert(users)
      .values({
        fullName: fullName,
        email: email,
        idCard: formData.get('idCard') as string,
        phone: formData.get('phone') as string,
        password: formData.get('password') as string,
        gender: formData.get('gender') as string,
        weight: Number(formData.get('weight')),
        height: Number(formData.get('height')),
        birthDate: formData.get('birthDate') as string,
        emergencyContactName: formData.get('emergencyContactName') as string,
        emergencyContactPhone: formData.get('emergencyContactPhone') as string,
        isMember: isAlreadyMember,
        photoUrl: photoUrl,
        // Records
        record5k: formData.get('record5k') as string,
        record10k: formData.get('record10k') as string,
        record21k: formData.get('record21k') as string,
        record42k: formData.get('record42k') as string,
        recordWkg: formData.get('recordWkg') as string,
      })
      .returning()
      .get()

    // 2. Si no es miembro, crear solicitud de membresía
    if (!isAlreadyMember) {
      await db
        .insert(membershipRequests)
        .values({
          userId: newUser.id,
          goals: JSON.stringify(formData.getAll('goals')),
          selectedPlan: formData.get('trainingDays') as string,
          status: 'pending',
        })
        .run()
    }

    return new Response(JSON.stringify({ 
      message: 'Registro completado con éxito', 
      userId: newUser.id,
      photoUrl: photoUrl 
    }), {
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
