// src/app/(frontend)/spaces/[spaceId]/page.tsx

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/spaces/utilities/payload/getPayloadClient";
import { getCurrentUser } from "@/spaces/utilities/getCurrentUser";
import { Metadata } from 'next';
import type { Space, Member } from '@/payload-types';

interface SpacePageProps {
  params: Promise<{
    spaceId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Update metadata generation to handle Promise-based params
export async function generateMetadata({ params }: SpacePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const payload = await getPayloadClient();

  try {
    const space = await payload.findByID({
      collection: 'spaces',
      id: resolvedParams.spaceId,
    });

    return {
      title: space?.name || 'Space',
      description: `Space: ${space?.name || 'Not Found'}`,
    };
  } catch (error) {
    return {
      title: 'Space',
      description: 'Space Details',
    };
  }
}

async function getSpaceData(spaceId: string, userId: string) {
  const payload = await getPayloadClient();

  try {
    const [space, members] = await Promise.all([
      payload.findByID({
        collection: 'spaces',
        id: spaceId,
        depth: 2,
        where: {
          'members.user': {
            equals: userId
          }
        }
      }),
      payload.find({
        collection: 'members',
        where: {
          space: {
            equals: spaceId
          }
        },
        depth: 2
      })
    ]);

    const channels = await payload.find({
      collection: 'channels',
      where: {
        space: {
          equals: spaceId
        },
        name: {
          equals: 'general'
        }
      },
      sort: 'createdAt',
      limit: 1
    });

    return {
      space: space as Space,
      members: members.docs as Member[],
      initialChannel: channels.docs[0]
    };
  } catch (error) {
    console.error('Error fetching space data:', error);
    return null;
  }
}

export default async function SpacePage({ params }: SpacePageProps) {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const data = await getSpaceData(resolvedParams.spaceId, user.id);

  if (!data || !data.space) {
    return redirect("/");
  }

  const initialChannel = data.initialChannel;

  if (!initialChannel) {
    return redirect("/");
  }

  return redirect(`/spaces/${data.space.id}/channels/${initialChannel.id}`);
}
