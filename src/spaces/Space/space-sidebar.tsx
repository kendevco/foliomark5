// path: src/components/Spaces/space/space-sidebar.tsx
"use client";

import * as React from 'react';
import type { ReactElement } from 'react';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Space, Channel, Member, Profile } from "@/payload-types";
import { SpaceHeader } from "./space-header";
import { SpaceSearch } from "./space-search";
import { SpaceSection } from "./space-section";
import { SpaceChannel } from "./space-channel";
import { SpaceMember } from "./space-member";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/components/providers/socket-provider";
import { Hash, Mic, Video } from "lucide-react";
import { ChannelType, MemberRole } from "@/spaces/collections/types";

// Define the icon map with specific channel types
const iconMap: Record<ChannelType, ReactElement> = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

interface SpaceSidebarProps {
  spaceId: string;
}

export const SpaceSidebar = ({ spaceId }: SpaceSidebarProps) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [members, setMembers] = useState<(Member & { profile: Profile })[]>([]);
  const params = useParams();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await fetch(`/api/spaces/${spaceId}`);
        const data = await response.json();
        setSpace(data);
        setChannels(data.channels || []);
        setMembers(data.members || []);
      } catch (error) {
        console.error('Error fetching space data:', error);
      }
    };

    fetchSpaceData();
  }, [spaceId]);

  if (!space) return null;

  const textChannels = channels.filter(channel => channel.type === ChannelType.TEXT);

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      {space && <SpaceHeader space={space} />}
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SpaceSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channel.type && iconMap[channel.type as ChannelType] || iconMap[ChannelType.TEXT]
                }))
              },
              {
                label: "Members",
                type: "member",
                data: members.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: null
                }))
              }
            ]}
          />
        </div>
        <div className="space-y-[2px]">
          <SpaceSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={space?.owner === params?.memberId ? MemberRole.ADMIN : MemberRole.GUEST}
            label="Text Channels"
          />
          {textChannels.map((channel) => (
            <SpaceChannel
              key={channel.id}
              channel={{
                ...channel,
                type: channel.type as ChannelType,
                spaceId: space.id
              }}
              space={space}
              role={space?.owner === params?.memberId ? MemberRole.ADMIN : MemberRole.GUEST}
            />
          ))}
        </div>
        <div className="space-y-[2px] mt-4">
          <SpaceSection
            sectionType="members"
            role={space?.owner === params?.memberId ? MemberRole.ADMIN : MemberRole.GUEST}
            label="Members"
          />
          {members.map((member) => (
            <SpaceMember
              key={member.id}
              member={member}
              space={space}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
