import { Access, PayloadRequest } from 'payload';
import { User } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getGlobals';

// Define valid global slugs
type GlobalSlug = 'settings' | 'header' | 'footer';

// Define the response type for findGlobal
type FindGlobalResponse = {
  spaceSettings?: {
    homeSpace?: string;
    allowMultipleSpaces?: boolean;
    maxSpacesPerUser?: number;
  };
};

export const isAdminInHomeSpace = async (user: User, payload: PayloadRequest['payload']): Promise<boolean> => {
  try {
    const settings = await getCachedGlobal('settings')() as FindGlobalResponse;

    const homeSpaceId = settings?.spaceSettings?.homeSpace;

    if (!homeSpaceId) return false;

    const member = await payload.find({
      collection: 'members',
      where: {
        user: {
          equals: user.id,
        },
        space: {
          equals: homeSpaceId,
        },
        role: {
          equals: 'admin',
        },
      },
      limit: 1,
    });

    return member.totalDocs > 0;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

const isAdmin: Access = async ({ req }) => {
  const user = req.user as User | undefined;
  if (!user) return false;

  return isAdminInHomeSpace(user, req.payload);
};

export default isAdmin;
