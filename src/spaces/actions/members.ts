'use server'

import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient'
import { revalidatePath } from 'next/cache'
import { MemberRole } from '@/spaces/collections/types'

export async function searchMembers(query: string, spaceId: string) {
  const payload = await getPayloadClient()

  try {
    const result = await payload.find({
      collection: 'members',
      where: {
        'profile.name': {
          contains: query,
        },
        space: {
          equals: spaceId,
        },
      },
      depth: 1,
    })

    return result.docs.map((member) => ({
      id: member.id,
      name: member.profile.name,
      email: member.profile.email,
      imageUrl: member.profile.imageUrl,
    }))
  } catch (error) {
    console.error('Error searching members:', error)
    return []
  }
}

export async function addMember(userId: string, spaceId: string) {
  const payload = await getPayloadClient()

  try {
    const member = await payload.create({
      collection: 'members',
      data: {
        user: userId,
        space: spaceId,
        role: MemberRole.MEMBER, // Use enum value
      },
    })

    revalidatePath(`/spaces/${spaceId}`)
    return member
  } catch (error) {
    console.error('Error adding member:', error)
    throw error
  }
}

export async function updateMemberRole(memberId: string, role: MemberRole) {
  const payload = await getPayloadClient()

  try {
    const member = await payload.update({
      collection: 'members',
      id: memberId,
      data: {
        role,
      },
    })

    if (member.space) {
      revalidatePath(`/spaces/${member.space}`)
    }

    return member
  } catch (error) {
    console.error('Error updating member role:', error)
    throw error
  }
}

export async function removeMember(memberId: string) {
  const payload = await getPayloadClient()

  try {
    const member = await payload.delete({
      collection: 'members',
      id: memberId,
    })

    if (member.space) {
      revalidatePath(`/spaces/${member.space}`)
    }

    return member
  } catch (error) {
    console.error('Error removing member:', error)
    throw error
  }
}
