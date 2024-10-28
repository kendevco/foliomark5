'use server'

import { getPayloadClient } from './getPayloadClient';
import { User } from '@/payload-types';
import { cookies } from "next/headers";

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const payload = await getPayloadClient();
    const cookieStore = await cookies(); // Add await here
    const token = cookieStore.get('payload-token')?.value;

    if (!token) return null;

    const { user } = await payload.verifyToken({
      collection: 'users',
      token,
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
