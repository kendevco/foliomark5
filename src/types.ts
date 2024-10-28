import { Server as NetSpace, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOSpace } from "socket.io";
import { Space, Member, Profile, Channel, MemberRole } from "@/payload-types";

export interface SpaceWithMembersWithProfiles extends Space {
  members: (Member & {
    profile: Profile
  })[];
  channels: Channel[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetSpace & {
            io: SocketIOSpace;
        };
    };
};

export interface SafeProfile {
  id: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedSpace extends Omit<Space, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  members: (Omit<Member, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    profile: Omit<Profile, 'createdAt' | 'updatedAt'> & {
      createdAt: string;
      updatedAt: string;
    };
  })[];
  channels: (Omit<Channel, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  })[];
}

export interface SerializedMember {
  id: string;
  role: MemberRole;
  profileId: string;
  SpaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedChannel {
  id: string;
  name: string;
  type: string;
  SpaceId: string;
  createdAt: string;
  updatedAt: string;
  // ... other fields if necessary ...
}

export interface MessageWithMemberWithProfile {
  id: string;
  content: string;
  fileUrl: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  member: {
    id: string;
    role: MemberRole;
    profile: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  };
}
