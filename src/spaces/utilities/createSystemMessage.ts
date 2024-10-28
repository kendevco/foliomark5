import getPayloadClient from '@/spaces/utilities/payload/getPayloadClient'

export async function createSystemMessage(channelId: string, content: string): Promise<any> {
  try {
    const payload = await getPayloadClient()

    const systemMessage = await payload.create({
      collection: 'messages',
      data: {
        content: `System message: ${content}`,
        channel: channelId,
        role: 'system',
      },
    })

    return systemMessage
  } catch (error) {
    console.error('Error creating system message:', error)
    return null
  }
}
