import { NextApiRequest } from "next";
import { getPayloadClient } from "@payloadcms/next";

export async function currentProfilePages(req: NextApiRequest) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.getUser();

    if (!user) {
      return null;
    }

    const profile = await payload.find({
      collection: 'profiles',
      where: {
        userId: { equals: user.id },
      },
      limit: 1,
    });

    return profile.docs[0] || null;
  } catch (error) {
    console.error("CURRENT_PROFILE_PAGES_ERROR", error);
    return null;
  }
}
