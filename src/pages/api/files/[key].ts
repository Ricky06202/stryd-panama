import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const { key } = params
  if (!key) return new Response('Key required', { status: 400 })

  const bucket = locals.runtime.env.strydpanama_bucket
  if (!bucket) {
    return new Response('R2 bucket binding not found', { status: 500 })
  }

  const object = await bucket.get(key)

  if (!object) {
    return new Response('File not found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)

  // Force download for GPX files if needed, or just serve with correct content-type
  if (key.endsWith('.gpx')) {
    headers.set(
      'Content-Disposition',
      `attachment; filename="${key.split('-').slice(1).join('-')}"`,
    )
  }

  return new Response(object.body, {
    headers,
  })
}
