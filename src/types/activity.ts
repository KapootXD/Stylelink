export type ActivityType = 'like' | 'comment' | 'follow' | 'view';

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  actorId: string;
  actorName: string;
  actorUsername?: string;
  actorAvatar?: string;
  targetUserId: string;
  postId?: string;
  postTitle?: string;
  content?: string;
  createdAt: Date;
}

export interface ActivityInput {
  type: ActivityType;
  actorId: string;
  actorName: string;
  actorUsername?: string;
  actorAvatar?: string;
  targetUserId: string;
  postId?: string;
  postTitle?: string;
  content?: string;
  createdAt?: Date;
}
