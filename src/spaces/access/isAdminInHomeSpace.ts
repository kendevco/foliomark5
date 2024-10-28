import { User, PayloadRequest } from 'payload'
import { cache } from 'react'
import { getCachedAdminStatus } from '../../../utilities/cache/adminCache.js'

export const isAdminInHomeSpace = async (user: User, payload: PayloadRequest['payload']): Promise<boolean> => {
  return getCachedAdminStatus(String(user.id), async () => {
    try {
      // Use find instead of aggregate for Payload 3.0
      const spaces = await payload.find({
        collection: 'spaces',
        where: {
          name: {
            equals: 'Home'
          }
        },
        limit: 1
      })

      if (spaces.totalDocs === 0) return false

      const members = await payload.find({
        collection: 'members',
        where: {
          user: {
            equals: user.id
          },
          space: {
            equals: spaces.docs[0].id
          },
          role: {
            equals: 'admin'
          }
        },
        limit: 1
      })

      return members.totalDocs > 0
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  })
}
