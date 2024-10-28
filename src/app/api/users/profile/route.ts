import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/spaces/utilities/payload/getCurrentUser'
import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient'

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const payload = await getPayloadClient()
    const { name, avatar } = await req.json()

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        name,
        avatar,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[PROFILE_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
