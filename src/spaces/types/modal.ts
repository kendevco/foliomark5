import { Space, Channel, Member } from '@/payload-types';

// Modal-specific types
export interface ModalData {
  space?: Space;
  spaceId?: string;
  spaceName?: string;
  spaceIcon?: string;
  members?: Member[];
  channel?: Channel;
  channelType?: 'text' | 'audio' | 'video';
  apiUrl?: string;
  query?: Record<string, any>;
}

export type ModalType =
  | "createSpace"
  | "invite"
  | "editSpace"
  | "members"
  | "createChannel"
  | "editChannel"
  | "deleteChannel"
  | "messageFile"
  | "deleteMessage"
  | "leaveSpace"
  | "deleteSpace";
