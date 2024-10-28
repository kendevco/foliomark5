'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient'
import { Message } from '@/spaces/collections/types'

export async function createMessage(
  channelId: string,
  content: string,
  fileUrl?: string,
): Promise<Message> {
  const payload = await getPayloadClient()

  try {
    const message = await payload.create({
      collection: 'messages',
      data: {
        content,
        fileUrl,
        channelId,
      },
    })

    revalidatePath(`/spaces/${channelId}`)
    return message
  } catch (error) {
    console.error('Error creating message:', error)
    throw error
  }
}

export async function updateMessage(messageId: string, content: string): Promise<Message> {
  const payload = await getPayloadClient()

  try {
    const message = await payload.update({
      collection: 'messages',
      id: messageId,
      data: {
        content,
        isUpdated: true,
      },
    })

    revalidatePath(`/spaces/${message.channelId}`)
    return message
  } catch (error) {
    console.error('Error updating message:', error)
    throw error
  }
}

export async function deleteMessage(messageId: string): Promise<void> {
  const payload = await getPayloadClient()

  try {
    await payload.delete({
      collection: 'messages',
      id: messageId,
    })

    revalidatePath('/spaces')
  } catch (error) {
    console.error('Error deleting message:', error)
    throw error
  }
}
