import { Access } from 'payload';
import { User } from '@/payload-types';
import isAdmin, { isAdminInHomeSpace } from './isAdmin';
import isCreator from './isCreator';

const isAdminOrCreator: Access = async ({ req, data }) => {
  const user = req.user as User | undefined;
  if (!user) return false;

  // Check admin status
  if (await isAdminInHomeSpace(user, req.payload)) return true;

  // Check creator status
  if (data && user.id === data.createdBy) return true;

  return false;
};

export default isAdminOrCreator;
