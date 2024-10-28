// path: src/app/(frontend)/spaces/[spaceId]/conversations/[memberId]/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/spaces/utilities/payload/getCurrentUser";
import { getPayloadClient } from "@/spaces/utilities/payload/getPayloadClient";
import { ChatHeader } from "@/spaces/components/chat/chat-header";
import { ChatMessages } from "@/spaces/components/chat/chat-messages";
import { ChatInput } from "@/spaces/components/chat/chat-input";
import { MediaRoom } from "@/spaces/components/media-room";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Conversation',
  description: 'Direct message conversation',
};

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const user = await getCurrentUser();
  const payload = await getPayloadClient();

  if (!user) {
    return redirect("/sign-in");
  }

  try {
    // Find the current member in the space
    const currentMember = await payload.find({
      collection: 'members',
      where: {
        space: {
          equals: params.spaceId
        },
        user: {
          equals: user.id
        }
      },
      depth: 1
    });

    if (!currentMember.docs.length) {
      return redirect("/");
    }

    // Get or create conversation
    const conversation = await payload.find({
      collection: 'conversations',
      where: {
        or: [
          {
            and: [
              { memberOne: { equals: currentMember.docs[0].id } },
              { memberTwo: { equals: params.memberId } }
            ]
          },
          {
            and: [
              { memberOne: { equals: params.memberId } },
              { memberTwo: { equals: currentMember.docs[0].id } }
            ]
          }
        ]
      },
      depth: 2
    });

    let conversationDoc = conversation.docs[0];

    if (!conversationDoc) {
      // Create new conversation if it doesn't exist
      conversationDoc = await payload.create({
        collection: 'conversations',
        data: {
          memberOne: currentMember.docs[0].id,
          memberTwo: params.memberId,
        }
      });
    }

    if (!conversationDoc) {
      return redirect(`/spaces/${params.spaceId}`);
    }

    // Get the other member's details
    const otherMember = await payload.findByID({
      collection: 'members',
      id: params.memberId,
      depth: 1
    });

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          imageUrl={otherMember.user.avatar?.url}
          name={otherMember.user.name}
          spaceId={params.spaceId}
          type="conversation"
        />
        {searchParams.video && (
          <MediaRoom
            chatId={conversationDoc.id}
            video={true}
            audio={true}
          />
        )}
        {!searchParams.video && (
          <>
            <ChatMessages
              member={currentMember.docs[0]}
              name={otherMember.user.name}
              chatId={conversationDoc.id}
              type="conversation"
              apiUrl="/api/direct-messages"
              paramKey="conversationId"
              paramValue={conversationDoc.id}
              socketUrl="/api/socket/direct-messages"
              socketQuery={{
                conversationId: conversationDoc.id,
              }}
            />
            <ChatInput
              name={otherMember.user.name}
              type="conversation"
              apiUrl="/api/socket/direct-messages"
              query={{
                conversationId: conversationDoc.id,
              }}
            />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in MemberIdPage:", error);
    return redirect(`/spaces/${params.spaceId}`);
  }
}
