// path: src/app/(frontend)/spaces/[spaceId]/channels/[channelId]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/spaces/utilities/payload/getCurrentUser';
import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient';
import { ChatHeader } from '@/spaces/chat/chat-header';
import { ChatMessages } from '@/spaces/chat/chat-messages';
import { ChatInput } from '@/spaces/chat/chat-input';
import { MediaRoom } from '@/spaces/components/media-room';

export const metadata: Metadata = {
  title: 'Channel',
  description: 'Channel page',
};

interface ChannelPageProps {
  params: Promise<{
    spaceId: string;
    channelId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChannelPage({
  params,
  searchParams
}: ChannelPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();
  const payload = await getPayloadClient();

  if (!user) {
    redirect('/sign-in');
  }

  try {
    const { channelId, spaceId } = resolvedParams;

    // Find the channel and check membership
    const channel = await payload.find({
      collection: 'channels',
      where: {
        id: {
          equals: channelId,
        },
        space: {
          equals: spaceId,
        },
      },
      depth: 1,
    });

    if (!channel.docs.length) {
      redirect('/');
    }

    // Get current member
    const member = await payload.find({
      collection: 'members',
      where: {
        space: {
          equals: spaceId,
        },
        user: {
          equals: user.id,
        },
      },
      depth: 1,
    });

    if (!member.docs.length) {
      redirect('/');
    }

    const channelDoc = channel.docs[0];

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          name={channelDoc.name}
          spaceId={spaceId}
          type="channel"
        />
        {resolvedSearchParams?.video && channelDoc.type !== 'TEXT' && (
          <MediaRoom
            chatId={channelDoc.id}
            video={channelDoc.type === 'VIDEO'}
            audio={channelDoc.type === 'AUDIO'}
          />
        )}
        {(!resolvedSearchParams?.video || channelDoc.type === 'TEXT') && (
          <>
            <ChatMessages
              member={member.docs[0]}
              name={channelDoc.name}
              chatId={channelDoc.id}
              type="channel"
              apiUrl="/api/messages"
              paramKey="channelId"
              paramValue={channelDoc.id}
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channelDoc.id,
                spaceId: spaceId,
              }}
            />
            <ChatInput
              name={channelDoc.name}
              type="channel"
              apiUrl="/api/messages"
              query={{
                channelId: channelDoc.id,
                spaceId: spaceId,
              }}
            />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in ChannelPage:', error);
    redirect('/');
  }
}
