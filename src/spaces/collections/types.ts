import { CollectionConfig } from 'payload'
import type { Space as PayloadSpace } from '@/payload-types';

// Core enums for Spaces
export enum ChannelType {
  TEXT = 'text',
  AUDIO = 'audio',
  VIDEO = 'video'
}

export enum MemberRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
  GUEST = 'guest'
}

// Media Categories as a const object instead of enum
export const MediaCategories = {
  SPACE: 'space',
  PROFILE: 'profile',
  MESSAGE: 'message',
  CHANNEL: 'channel',
} as const;

export type MediaCategory = typeof MediaCategories[keyof typeof MediaCategories];

// Collection slugs
export const CollectionSlugs = {
  USERS: 'users',
  MEDIA: 'media',
  SPACES: 'spaces',
  CHANNELS: 'channels',
  MEMBERS: 'members',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  DIRECT_MESSAGES: 'directMessages',
  PROFILES: 'profiles',
} as const;

export type SpaceCollectionSlug = typeof CollectionSlugs[keyof typeof CollectionSlugs];

export const isValidCollectionSlug = (slug: string): slug is SpaceCollectionSlug => {
  return Object.values(CollectionSlugs).includes(slug as SpaceCollectionSlug);
};

export interface SpaceCollection extends CollectionConfig {
  slug: SpaceCollectionSlug;
}

// Space Collections group
export const SPACE_COLLECTIONS = [
  CollectionSlugs.SPACES,
  CollectionSlugs.CHANNELS,
  CollectionSlugs.MEMBERS,
  CollectionSlugs.MESSAGES,
  CollectionSlugs.CONVERSATIONS,
  CollectionSlugs.DIRECT_MESSAGES,
  CollectionSlugs.PROFILES,
] as const;

// Modal types
export const ModalType = {
  DELETE_MESSAGE: 'deleteMessage',
  CREATE_SERVER: 'createServer',
  CREATE_SPACE: 'createSpace',
  INVITE: 'invite',
  EDIT_SERVER: 'editServer',
  MEMBERS: 'members',
  CREATE_CHANNEL: 'createChannel',
  LEAVE_SERVER: 'leaveServer',
  DELETE_SERVER: 'deleteServer',
  DELETE_CHANNEL: 'deleteChannel',
  EDIT_CHANNEL: 'editChannel',
  MESSAGE_FILE: 'messageFile',
  DELETE_SPACE: 'deleteSpace',
  LEAVE_SPACE: 'leaveSpace',
  EDIT_SPACE: 'editSpace',
} as const;

export type ModalType = typeof ModalType[keyof typeof ModalType];

// Add Media type definition
export interface Media {
  id: string;
  url: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
}

// Utility type to ensure consistent space shape
export interface TransformedSpace {
  id: string;
  name: string;
  description?: string;
  icon?: Media | string; // Match Payload's Media type
  owner: { id: string; relationTo: "users" };
  member?: Member;
  members?: { id: string; relationTo: 'members' }[];
  channels?: { id: string; relationTo: 'channels' }[];
  createdBy: { id: string; relationTo: "users" };
  createdAt: string;
  updatedAt: string;
}

// Update the transformSpace function to handle null values properly
export const transformSpace = (space: PayloadSpace): TransformedSpace => ({
  id: space.id,
  name: space.name,
  description: space.description || undefined,
  icon: space.icon ? (
    typeof space.icon === 'string' ? space.icon : {
      id: space.icon.id,
      url: space.icon.url || '',
      alt: space.icon.alt || '',
      updatedAt: space.icon.updatedAt,
      createdAt: space.icon.createdAt
    }
  ) : undefined,
  owner: {
    id: typeof space.owner === 'string' ? space.owner : space.owner.id,
    relationTo: "users"
  },
  members: space.members?.map(member => ({
    id: typeof member === 'string' ? member : member.id,
    relationTo: 'members'
  })) || undefined,
  channels: space.channels?.map(channel => ({
    id: typeof channel === 'string' ? channel : channel.id,
    relationTo: 'channels'
  })) || undefined,
  createdBy: {
    id: typeof space.createdBy === 'string' ? space.createdBy : space.createdBy.id,
    relationTo: "users"
  },
  createdAt: space.createdAt,
  updatedAt: space.updatedAt
});

// Update ModalData to include all needed properties
export interface ModalData {
  space?: TransformedSpace;
  channel?: Channel;
  spaceId?: string;
  channelId?: string;
  apiUrl?: string;
  query?: Record<string, any>;
}

export interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

// Add these interfaces to your types.ts file

export interface Profile {
  id: string
  name: string
  imageUrl: string | null
}

export interface Member {
  id: string
  role: string
  profileId: string
  spaceId: string
  profile: Profile
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  content: string
  fileUrl?: string | null
  deleted?: boolean
  member: Member
  isUpdated?: boolean
  createdAt: string
  updatedAt: string
}

// Update your existing ModalType to include loading state
export type LoadingState = 'loading' | 'error' | 'success' | 'pending'

export interface Space {
  id: string
  name: string
  description?: string | null
  icon?: Media | string | null
  owner: { id: string; relationTo: 'users' }
  member?: Member
  members?: { id: string; relationTo: 'members' }[]
  channels?: { id: string; relationTo: 'channels' }[]
  createdBy: { id: string; relationTo: 'users' }
  createdAt: string
  updatedAt: string
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  spaceId: string;
  createdAt: string;
  updatedAt: string;
}
