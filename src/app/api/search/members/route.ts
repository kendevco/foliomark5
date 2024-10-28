import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient'
import { getCurrentUser } from '@/spaces/utilities/getCurrentUser'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')
    const spaceId = searchParams.get('spaceId')

    if (!query) {
      return NextResponse.json([])
    }

    const payload = await getPayloadClient()

    // Search profiles that match the query
    const results = await payload.find({
      collection: 'profiles',
      where: {
        or: [
          {
            name: {
              like: query,
            },
          },
          {
            email: {
              like: query,
            },
          },
        ],
        // Exclude profiles already in the space
        and: [
          {
            'memberOf.space': {
              not_equals: spaceId,
            },
          },
        ],
      },
      limit: 10,
    })

    return NextResponse.json(
      results.docs.map((profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        imageUrl: profile.imageUrl,
      })),
    )
  } catch (error) {
    console.error('[MEMBERS_SEARCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
