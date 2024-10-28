import { CollectionConfig } from 'payload'
import { SpaceCollection, CollectionSlugs } from './types'
import Profiles from './Profiles'
import Spaces from './Spaces'
import Members from './Members'
import Channels from './Channels'
import Messages from './Messages'
import Conversations from './Conversations'
import DirectMessages from './DirectMessages'
import { SpacesMedia } from './SpacesMedia'

// Type-safe collection mapping
export const SpaceCollections: Record<CollectionSlugs, CollectionConfig> = {
  [CollectionSlugs.PROFILES]: Profiles,
  [CollectionSlugs.SPACES]: Spaces,
  [CollectionSlugs.MEMBERS]: Members,
  [CollectionSlugs.CHANNELS]: Channels,
  [CollectionSlugs.MESSAGES]: Messages,
  [CollectionSlugs.CONVERSATIONS]: Conversations,
  [CollectionSlugs.DIRECT_MESSAGES]: DirectMessages,
  [CollectionSlugs.MEDIA]: SpacesMedia,
}

// Array of collections for Payload configuration
export const spaceCollections = Object.values(SpaceCollections)

// Named exports for individual collections
export {
  Profiles,
  Spaces,
  Members,
  Channels,
  Messages,
  Conversations,
  DirectMessages,
  SpacesMedia,
}
