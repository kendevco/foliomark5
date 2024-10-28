import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { User } from '@/payload-types'
import { CollectionSlugs } from '@/spaces/collections//types'

// For Socket.io
export interface ServerIoResponse extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

// Import types from collections
import type {
  Profile,
  Member,
  Space,
  Channel,
  Message,
  DirectMessage,
  SpacesMedia,
} from '@/payload-types'

// Re-export collection types
export type { Profile, Member, Space, Channel, Message, DirectMessage, User }

// Extended types
export interface SpaceWithMembersWithProfiles extends Space {
  members: Member[]
}

// Use the roles from Members collection
export const MemberRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  GUEST: 'guest',
} as const

export type MemberRoleType = (typeof MemberRole)[keyof typeof MemberRole]

// Use the channel types from Channels collection
export const ChannelType = {
  TEXT: 'text',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const

export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType]
