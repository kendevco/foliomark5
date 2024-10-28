import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from '@/types'

import { getPayloadClient } from '@payloadcms/next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.getUser();
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    // Find conversation and check membership
    const conversation = await payload.find({
      collection: 'conversations',
      where: {
        id: { equals: conversationId as string },
        'participants.id': { equals: user.id }
      },
      depth: 2
    });

    if (!conversation.docs.length) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Find the member record
    const member = await payload.find({
      collection: 'members',
      where: {
        userId: { equals: user.id },
        conversationId: { equals: conversationId as string }
      }
    });

    if (!member.docs.length) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Find the direct message
    const message = await payload.find({
      collection: 'directMessages',
      where: {
        id: { equals: directMessageId as string },
        conversation: { equals: conversationId as string }
      },
      depth: 2
    });

    if (!message.docs.length || message.docs[0].deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const directMessage = message.docs[0];
    const isMessageOwner = directMessage.sender === user.id;
    const memberDoc = member.docs[0];
    const canModify = isMessageOwner || memberDoc.role === 'admin' || memberDoc.role === 'moderator';

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let updatedMessage;

    if (req.method === "DELETE") {
      updatedMessage = await payload.update({
        collection: 'directMessages',
        id: directMessageId as string,
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        }
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      updatedMessage = await payload.update({
        collection: 'directMessages',
        id: directMessageId as string,
        data: {
          content,
        }
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, updatedMessage)

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.log("[DIRECT_MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
