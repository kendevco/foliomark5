import getPayloadClient from '../utilities/getPayloadClient'
import type { Channel } from '@/payload-types'

export const channelService = {
  async getChannel(id: string) {
    const payload = await getPayloadClient()
    return payload.findByID({
      collection: 'channels',
      id,
      depth: 2,
    })
  },

  async getChannels(spaceId: string) {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'channels',
      where: {
        space: {
          equals: spaceId,
        },
      },
      depth: 2,
    })
  },

  async createChannel(data: Partial<Channel>) {
    const payload = await getPayloadClient()
    return payload.create({
      collection: 'channels',
      data,
    })
  },

  async updateChannel(id: string, data: Partial<Channel>) {
    const payload = await getPayloadClient()
    return payload.update({
      collection: 'channels',
      id,
      data,
    })
  },

  async deleteChannel(id: string) {
    const payload = await getPayloadClient()
    return payload.delete({
      collection: 'channels',
      id,
    })
  },
}
