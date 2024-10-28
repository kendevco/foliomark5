import type { AccessArgs } from 'payload'
import type { PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export const getCurrentUser = async ({ req }: AccessArgs<User>): Promise<User | null> => {
  try {
    // In Payload 3.0, we use the local API directly
    const users = await req.payload.find({
      collection: 'users',
      limit: 1,
      // Add any necessary filters for admin users
      where: {
        roles: {
          contains: 'admin'
        }
      }
    });

    return users.docs[0] || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const authenticated = ({ req }: AccessArgs<User>): boolean => {
  return Boolean(req.user)
}
