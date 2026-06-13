import { NextResponse } from 'next/server'

function getExpectedToken() {
  return (process.env.INGRESAX_MOBILE_API_TOKEN ?? process.env.MOBILE_API_TOKEN ?? '').trim()
}

export function mobileUnauthorizedResponse(request: Request) {
  const expectedToken = getExpectedToken()

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Mobile API token is not configured.' },
      { status: 503 },
    )
  }

  const authorization = request.headers.get('authorization') ?? ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''

  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  return null
}
