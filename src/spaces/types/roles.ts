export enum MemberRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

export type Role = keyof typeof MemberRole;
