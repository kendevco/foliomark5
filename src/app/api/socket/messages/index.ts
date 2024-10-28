import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import { getPayloadClient } from '@payloadcms/next'
import { MemberRole } from '@/spaces/types/roles'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.getUser()
    const { content, fileUrl } = req.body
    const { channelId } = req.query

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' })
    }

    const message = await payload.create({
      collection: 'messages',
      data: {
        content,
        fileUrl,
        channel: channelId as string,
        author: user.id,
      },
    })

    const channelKey = `chat:${channelId}:messages`
    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[MESSAGES_POST]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
