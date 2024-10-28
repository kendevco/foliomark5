import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import { getPayloadClient } from '@payloadcms/next'
import { MemberRole } from '@/spaces/types/roles'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.getUser()
    const { messageId, spaceId, channelId } = req.query
    const { content } = req.body

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!spaceId) {
      return res.status(400).json({ error: 'Space ID missing' })
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' })
    }

    // Find space and check membership
    const space = await payload.find({
      collection: 'spaces',
      where: {
        id: { equals: spaceId as string },
        'members.user.id': { equals: user.id },
      },
      depth: 2,
    })

    if (!space.docs.length) {
      return res.status(404).json({ error: 'Space not found' })
    }

    // Find member
    const member = await payload.find({
      collection: 'members',
      where: {
        user: { equals: user.id },
        space: { equals: spaceId as string },
      },
    })

    if (!member.docs.length) {
      return res.status(404).json({ error: 'Member not found' })
    }

    // Find message
    const message = await payload.find({
      collection: 'messages',
      where: {
        id: { equals: messageId as string },
        channel: { equals: channelId as string },
      },
      depth: 2,
    })

    if (!message.docs.length || message.docs[0].deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const currentMessage = message.docs[0]
    const isMessageOwner = currentMessage.author === user.id
    const memberDoc = member.docs[0]
    const canModify =
      isMessageOwner ||
      memberDoc.role === MemberRole.ADMIN ||
      memberDoc.role === MemberRole.MODERATOR

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    let updatedMessage

    if (req.method === 'DELETE') {
      updatedMessage = await payload.update({
        collection: 'messages',
        id: messageId as string,
        data: {
          fileUrl: null,
          content: 'This message has been deleted',
          deleted: true,
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      updatedMessage = await payload.update({
        collection: 'messages',
        id: messageId as string,
        data: {
          content,
        },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, updatedMessage)

    return res.status(200).json(updatedMessage)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
