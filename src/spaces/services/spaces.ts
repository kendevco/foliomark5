import getPayloadClient from '../utilities/getPayloadClient'
import type { Space } from '@/payload-types'

export const spaceService = {
  async getSpace(id: string) {
    const payload = await getPayloadClient()
    return payload.findByID({
      collection: 'spaces',
      id,
      depth: 2,
    })
  },

  async getSpaces() {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'spaces',
      depth: 2,
    })
  },

  async createSpace(data: Partial<Space>) {
    const payload = await getPayloadClient()
    return payload.create({
      collection: 'spaces',
      data,
    })
  },

  async updateSpace(id: string, data: Partial<Space>) {
    const payload = await getPayloadClient()
    return payload.update({
      collection: 'spaces',
      id,
      data,
    })
  },

  async deleteSpace(id: string) {
    const payload = await getPayloadClient()
    return payload.delete({
      collection: 'spaces',
      id,
    })
  },
}
