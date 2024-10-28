"use client";

import { useEffect, useState } from "react";
import { Space } from "@/payload-types";
import { SpaceSidebar } from "./space-sidebar";
import { ChatHeader } from "../chat/chat-header";
import { ChatInput } from "../chat/chat-input";
import { ChatMessages } from "../chat/chat-messages";
import { MemberRole } from '@/spaces/collections/types';

interface SpaceLayoutProps {
  space: Space;
  children?: React.ReactNode;
}

export const SpaceLayout = ({ space: initialSpace, children }: SpaceLayoutProps) => {
  const [space, setSpace] = useState(initialSpace);

  useEffect(() => {
    if (initialSpace) {
      setSpace(initialSpace);
    }
  }, [initialSpace]);

  // Create a default member if none exists
  const defaultMember = {
    id: space.id,
    role: MemberRole.MEMBER,
    profileId: space.id,
    spaceId: space.id,
    profile: {
      id: space.id,
      name: space.name,
      imageUrl: null,
      email: '', // Add required email field
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Get the first member or use default
  const member = space.members?.[0] ? {
    id: typeof space.members[0] === 'string' ? space.members[0] : space.members[0].id,
    role: MemberRole.MEMBER,
    profileId: space.id,
    spaceId: space.id,
    profile: {
      id: space.id,
      name: space.name,
      imageUrl: null,
      email: '', // Add required email field
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } : defaultMember;

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <SpaceSidebar spaceId={space.id} />
      </div>
      <main className="h-full md:pl-60">
        <ChatHeader
          spaceId={space.id}
          name={space.name}
          type="channel"
        />
        <ChatMessages
          name={space.name}
          member={member} // Now member is always defined
          chatId={space.id}
          apiUrl={`/api/spaces/${space.id}/messages`}
          socketUrl={`/api/socket/spaces/${space.id}`}
          socketQuery={{ spaceId: space.id }}
          paramKey="channelId"
          paramValue={space.id}
          type="channel"
        />
        <ChatInput
          name={space.name}
          type="channel"
          apiUrl={`/api/spaces/${space.id}/messages`}
          query={{ spaceId: space.id }}
        />
      </main>
    </div>
  );
};
