import { CollectionConfig } from 'payload'
import { CollectionSlug } from 'payload'
import { MemberRole, CollectionSlugs } from './types'

const usersSlug: CollectionSlug = 'users' as CollectionSlug
const spacesSlug: CollectionSlug = 'spaces' as CollectionSlug

const Members: CollectionConfig = {
  slug: CollectionSlugs.MEMBERS,
  admin: {
    useAsTitle: 'user',
    group: 'Spaces',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: usersSlug,
      required: true,
    },
    {
      name: 'space',
      type: 'relationship',
      relationTo: spacesSlug,
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: Object.values(MemberRole),
      defaultValue: MemberRole.MEMBER,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const { user } = req;
        if (!user) return;

        const payload = req.payload;
        const homeSpace = await payload.find({
          collection: 'spaces',
          where: {
            name: {
              equals: 'Home',
            },
          },
        });

        if (homeSpace.totalDocs === 0) {
          // Create "Home" space and add user as admin
          const newSpace = await payload.create({
            collection: 'spaces',
            data: {
              name: 'Home',
              createdBy: user.id,
              owner: user.id, // Required field
              members: [], // Required field, will be populated after space creation
              channels: [], // Required field, will be populated with default channels
              description: 'Home Space', // Optional but good to have
            },
          });

          // Create initial member entry for the creator
          const newMember = await payload.create({
            collection: 'members',
            data: {
              user: user.id,
              space: newSpace.id,
              role: MemberRole.ADMIN,
            },
          });

          // Update the space with the new member
          await payload.update({
            collection: 'spaces',
            id: newSpace.id,
            data: {
              members: [newMember.id],
            },
          });

        } else {
          // Add user as guest to existing "Home" space
          const newMember = await payload.create({
            collection: 'members',
            data: {
              user: user.id,
              space: homeSpace.docs[0].id,
              role: MemberRole.GUEST,
            },
          });

          // Update the space's members array
          await payload.update({
            collection: 'spaces',
            id: homeSpace.docs[0].id,
            data: {
              members: [...(homeSpace.docs[0].members || []), newMember.id],
            },
          });
        }
      },
    ],
  },
}

export default Members
