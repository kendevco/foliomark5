import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import getPayloadClient from '@/spaces/utilities/getPayloadClient'
import { getCurrentUserWithProfile } from '@/spaces/utilities'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const user = await getCurrentUserWithProfile(payload)

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
