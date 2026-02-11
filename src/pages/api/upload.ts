import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    const bucket = locals.runtime.env.strydpanama_bucket
    if (!bucket) {
      return new Response('R2 bucket binding not found', { status: 500 })
    }

    const fileName = `${Date.now()}-${file.name}`
    const arrayBuffer = await file.arrayBuffer()

    await bucket.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
    })

    // Return the key/filename to be stored in the database
    // The actual URL will depend on the public domain or a proxy endpoint
    // For now we store the key
    return new Response(JSON.stringify({ key: fileName }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return new Response('Upload failed', { status: 500 })
  }
}
