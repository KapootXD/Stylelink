import { CreateUserData, GetVideosData, LikeVideoData, LikeVideoVariables, GetMySavedVideosData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useGetVideos(options?: useDataConnectQueryOptions<GetVideosData>): UseDataConnectQueryResult<GetVideosData, undefined>;
export function useGetVideos(dc: DataConnect, options?: useDataConnectQueryOptions<GetVideosData>): UseDataConnectQueryResult<GetVideosData, undefined>;

export function useLikeVideo(options?: useDataConnectMutationOptions<LikeVideoData, FirebaseError, LikeVideoVariables>): UseDataConnectMutationResult<LikeVideoData, LikeVideoVariables>;
export function useLikeVideo(dc: DataConnect, options?: useDataConnectMutationOptions<LikeVideoData, FirebaseError, LikeVideoVariables>): UseDataConnectMutationResult<LikeVideoData, LikeVideoVariables>;

export function useGetMySavedVideos(options?: useDataConnectQueryOptions<GetMySavedVideosData>): UseDataConnectQueryResult<GetMySavedVideosData, undefined>;
export function useGetMySavedVideos(dc: DataConnect, options?: useDataConnectQueryOptions<GetMySavedVideosData>): UseDataConnectQueryResult<GetMySavedVideosData, undefined>;
