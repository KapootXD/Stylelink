import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface Follow_Key {
  followerId: UUIDString;
  followedId: UUIDString;
  __typename?: 'Follow_Key';
}

export interface GetMySavedVideosData {
  savedVideos: ({
    video: {
      id: UUIDString;
      caption: string;
      videoUrl: string;
    } & Video_Key;
  })[];
}

export interface GetVideosData {
  videos: ({
    id: UUIDString;
    caption: string;
    videoUrl: string;
  } & Video_Key)[];
}

export interface LikeVideoData {
  like_insert: Like_Key;
}

export interface LikeVideoVariables {
  videoId: UUIDString;
}

export interface Like_Key {
  userId: UUIDString;
  videoId: UUIDString;
  __typename?: 'Like_Key';
}

export interface SavedVideo_Key {
  userId: UUIDString;
  videoId: UUIDString;
  __typename?: 'SavedVideo_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Video_Key {
  id: UUIDString;
  __typename?: 'Video_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface GetVideosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVideosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetVideosData, undefined>;
  operationName: string;
}
export const getVideosRef: GetVideosRef;

export function getVideos(): QueryPromise<GetVideosData, undefined>;
export function getVideos(dc: DataConnect): QueryPromise<GetVideosData, undefined>;

interface LikeVideoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LikeVideoVariables): MutationRef<LikeVideoData, LikeVideoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LikeVideoVariables): MutationRef<LikeVideoData, LikeVideoVariables>;
  operationName: string;
}
export const likeVideoRef: LikeVideoRef;

export function likeVideo(vars: LikeVideoVariables): MutationPromise<LikeVideoData, LikeVideoVariables>;
export function likeVideo(dc: DataConnect, vars: LikeVideoVariables): MutationPromise<LikeVideoData, LikeVideoVariables>;

interface GetMySavedVideosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMySavedVideosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMySavedVideosData, undefined>;
  operationName: string;
}
export const getMySavedVideosRef: GetMySavedVideosRef;

export function getMySavedVideos(): QueryPromise<GetMySavedVideosData, undefined>;
export function getMySavedVideos(dc: DataConnect): QueryPromise<GetMySavedVideosData, undefined>;

