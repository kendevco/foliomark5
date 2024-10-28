import { getPayloadClient } from '@payloadcms/next'

export async function createSystemMessage({
  content,
  channelId,
}: {
  content: string
  channelId: string
}) {
  try {
    const payload = await getPayloadClient()

    const message = await payload.create({
      collection: 'messages',
      data: {
        content,
        channel: channelId,
        isSystem: true,
      },
    })

    return message
  } catch (error) {
    console.error('[CREATE_SYSTEM_MESSAGE_ERROR]', error)
    return null
  }
}
