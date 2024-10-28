'use server'

import { getPayloadClient } from '@/spaces/utilities/getPayloadClient'

export type CreateSpaceData = {
  name: string
  imageUrl: string
}

export async function createSpace(data: CreateSpaceData) {
  try {
    const payload = await getPayloadClient()

    const space = await payload.create({
      collection: 'spaces',
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
      },
    })

    return {
      success: true,
      data: space,
    }
  } catch (error) {
    console.error('[CREATE_SPACE_ERROR]', error)
    return {
      success: false,
      error: 'Failed to create space',
    }
  }
}
