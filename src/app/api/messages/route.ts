import { NextResponse } from 'next/server'
import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { getCurrentUser } from '@/spaces/utilities/payload/getCurrentUser'
import getPayloadClient from '@/spaces/utilities/payload/getPayloadClient'
import { analyzeImage } from '@/spaces/utilities/analyzeImage'
import { createSystemMessage } from '@/spaces/utilities/createSystemMessage'

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayloadClient()

    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID missing' }, { status: 400 })
    }

    const where: any = {
      channel: {
        equals: channelId,
      },
    }

    if (cursor) {
      where.id = {
        less_than: cursor, // Assuming messages are sorted by 'createdAt' in descending order
      }
    }

    const messages = await payload.find({
      collection: 'messages',
      where,
      limit: MESSAGES_BATCH,
      sort: '-createdAt',
      depth: 2, // Adjust depth as needed to include related data
    })

    let nextCursor = null

    if (messages.docs.length === MESSAGES_BATCH) {
      nextCursor = messages.docs[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages.docs,
      nextCursor,
    })
  } catch (error) {
    console.error('[MESSAGES_GET]', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, fileUrl, channelId, messageId = uuidv4() } = await req.json()

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID missing' }, { status: 400 })
    }

    if (!content && !fileUrl) {
      return NextResponse.json({ error: 'Content or file URL missing' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Check for existing message
    const existingMessage = await payload.findByID({
      collection: 'messages',
      id: messageId,
    })

    if (existingMessage) {
      return NextResponse.json(existingMessage)
    }

    let analyzedContent = content

    if (fileUrl) {
      try {
        const analysisPrompt =
          content || 'Describe the image in detail, including relevant tags for later retrieval.'
        analyzedContent = await analyzeImage(fileUrl, analysisPrompt)
      } catch (error) {
        console.error('Image analysis failed:', error)
        analyzedContent = `${content || ''} [Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}]`
      }
    }

    // Create the user message
    const message = await payload.create({
      collection: 'messages',
      data: {
        id: messageId,
        content: analyzedContent,
        fileUrl: fileUrl || null,
        channel: channelId,
        member: user.id,
        role: 'user', // Assuming 'user' is a valid role
      },
      depth: 2, // Adjust as needed
    })

    // Emit the user message immediately via Socket.IO
    const io = (req as any).socket.server.io as Socket

    io.to(channelId).emit('message', message)

    // Create a system message asynchronously
    createSystemMessage(channelId, content)
      .then((systemMessage) => {
        if (systemMessage) {
          io.to(channelId).emit('message', systemMessage)
        }
      })
      .catch((error) => {
        console.error('Error creating system message:', error)
      })

    return NextResponse.json(message)
  } catch (error) {
    console.error('[MESSAGES_POST]', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
