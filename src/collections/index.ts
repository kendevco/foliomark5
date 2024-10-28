import { CollectionConfig } from 'payload'
import Profiles from '@/spaces/collections/Profiles'
import Spaces from '@/spaces/collections/Spaces'
import Members from '@/spaces/collections/Members'
import Channels from '@/spaces/collections/Channels'
import Messages from '@/spaces/collections/Messages'
import Conversations from '@/spaces/collections/Conversations'
import DirectMessages from '@/spaces/collections/DirectMessages'
import { SpacesMedia } from '@/spaces/collections/SpacesMedia'

export const collections: CollectionConfig[] = [
  Profiles,
  Spaces,
  Members,
  Channels,
  Messages,
  Conversations,
  DirectMessages,
  SpacesMedia,
]

// Re-export collections
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
