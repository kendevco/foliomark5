export type Space = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type Member = {
  id: string;
  role: 'admin' | 'moderator' | 'member';
  status?: 'online' | 'offline' | 'idle' | 'dnd';
  lastSeen?: string;
  profile: {
    id: string;
    name: string;
    imageUrl: string | null;
  }
}

export type Channel = {
  id: string;
  name: string;
  type: 'text' | 'audio' | 'video';
}
