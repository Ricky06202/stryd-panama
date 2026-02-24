import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, locals }) => {
  const RESEND_API_KEY = locals.runtime.env.RESEND_SECRET

  if (!RESEND_API_KEY) {
    console.error('RESEND_SECRET is not defined in locals.runtime.env')
    return new Response(
      JSON.stringify({
        error: 'Error de configuración del servidor',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    const data = (await request.json()) as any
    const { nombre, email, telefono, titulo, descripcion } = data

    if (!nombre || !email || !descripcion) {
      return new Response(
        JSON.stringify({
          error: 'Faltan campos obligatorios (nombre, email, descripcion)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Stryd Panama <onboarding@resend.dev>',
        to: 'eysbel@gmail.com',
        subject: `${titulo || 'Contacto desde Web'} - ${nombre}`,
        reply_to: email,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #f97316;">Nuevo Mensaje de Contacto</h2>
            <p><strong>De:</strong> ${nombre} (${email})</p>
            <p><strong>Teléfono:</strong> ${telefono || 'No provisto'}</p>
            <p><strong>Asunto:</strong> ${titulo || 'Sin asunto'}</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${descripcion}</p>
          </div>
        `,
      }),
    })

    const result = (await res.json()) as any

    if (!res.ok) {
      console.error('Error from Resend API:', result)
      return new Response(
        JSON.stringify({
          error: result.message || 'Resend API error',
          details: result,
        }),
        { status: res.status, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({
        message: '¡Mensaje enviado con éxito!',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in contact API:', error)
    return new Response(
      JSON.stringify({
        error: 'Error al procesar el mensaje automáticamente',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
