import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '@/spaces/utilities/getPayloadClient'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Use Payload's built-in logout operation
    /*     await payload.logout({
      collection: 'users',
      res: NextResponse.next(),
    }); */

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
