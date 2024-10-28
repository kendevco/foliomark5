import { CollectionConfig } from 'payload'

// Core collections
import Users from './Users'
import { Media } from './Media'
import { Pages } from './Pages'
import { Posts } from './Posts'
import Categories from './Categories'

// Spaces collections
import { Spaces } from './Spaces'

// Export collections grouped by feature
export const collections: CollectionConfig[] = [Users, Media, Pages, Posts, Categories, Spaces]

export * from './Spaces'
export { Users, Media, Pages, Posts, Categories }
