import { cookies } from 'next/headers'
import { getPayloadClient } from './payload/getPayloadClient'
import { User } from '@/payload-types'

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) return null

    const payload = await getPayloadClient()
    const { user } = await payload.validateToken({
      collection: 'users',
      token,
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
