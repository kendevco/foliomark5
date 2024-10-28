import { Space, Channel, Member, Profile } from '@/payload-types';

export type ModalType =
  | 'createSpace'
  | 'editSpace'
  | 'members'
  | 'createChannel'
  | 'editChannel'
  | 'deleteChannel'
  | 'leaveSpace'
  | 'deleteMessage'
  | 'messageFile'
  | 'invite';

export interface SpaceWithMembersWithProfiles extends Omit<Space, 'members'> {
  members: (Member & { profile: Profile })[];
}

export interface ModalData {
  space?: Space;
  channel?: Channel;
  apiUrl?: string;
  query?: Record<string, string>;
}
