import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { getPayloadClient } from '@payloadcms/next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.getUser();
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    // Find conversation and verify membership
    const conversation = await payload.find({
      collection: 'conversations',
      where: {
        id: { equals: conversationId as string },
        'participants.id': { equals: user.id }
      },
      depth: 2
    });

    if (!conversation.docs.length) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await payload.create({
      collection: 'directMessages',
      data: {
        content,
        fileUrl,
        conversation: conversationId as string,
        sender: user.id,
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
