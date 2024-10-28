import { cookies } from 'next/headers'
import { getPayloadClient } from './payload/getPayloadClient'
import { User } from '@/payload-types'

export interface UserWithProfile extends User {
  profile?: {
    id: string
    name: string
    imageUrl?: string
    email: string
  }
}

// Helper function to fetch profile by user ID
const fetchUserProfile = async (userId: string) => {
  const payload = await getPayloadClient()
  const profile = await payload.find({
    collection: 'profiles',
    where: {
      userId: {
        equals: userId,
      },
    },
    limit: 1,
  })

  if (profile.docs.length > 0) {
    return {
      id: profile.docs[0].id,
      name: profile.docs[0].name,
      imageUrl: profile.docs[0].imageUrl,
      email: profile.docs[0].email,
    }
  }
  return null
}

export const getUserWithProfile = async (): Promise<UserWithProfile | null> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) return null

    const payload = await getPayloadClient()
    const { user } = await payload.validateToken({
      collection: 'users',
      token,
    })

    if (!user) return null

    const profile = await fetchUserProfile(user.id)

    return {
      ...user,
      profile: profile || undefined,
    }
  } catch (error) {
    console.error('Error getting user with profile:', error)
    return null
  }
}

export const getCurrentUserWithProfile = async (): Promise<UserWithProfile | null> => {
  const payload = await getPayloadClient()

  try {
    const cookieStore = await cookies()
    const token = (await cookieStore).get('payload-token')?.value

    if (!token) return null

    const { user } = await payload.verifyToken({
      collection: 'users',
      token,
    })

    if (!user) return null

    const profile = await fetchUserProfile(user.id)

    return {
      ...user,
      profile: profile || undefined,
    }
  } catch (error) {
    console.error('Error getting current user with profile:', error)
    return null
  }
}
