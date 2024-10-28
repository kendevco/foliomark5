export const MediaCategories = {
  SPACE_IMAGE: 'space',
  PROFILE: 'profile',
  MESSAGE: 'message',
  CHANNEL: 'channel',
} as const;

export type MediaCategory = typeof MediaCategories[keyof typeof MediaCategories];

export interface Media {
  id: string;
  url?: string;
  alt: string;
  category: MediaCategory;
  caption?: string;
  createdBy: string;
  uploadedBy: string;
}
