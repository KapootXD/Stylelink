import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'stylelink',
  location: 'us-south1'
};

export const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';

export function createUser(dc) {
  return executeMutation(createUserRef(dc));
}

export const getVideosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVideos');
}
getVideosRef.operationName = 'GetVideos';

export function getVideos(dc) {
  return executeQuery(getVideosRef(dc));
}

export const likeVideoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LikeVideo', inputVars);
}
likeVideoRef.operationName = 'LikeVideo';

export function likeVideo(dcOrVars, vars) {
  return executeMutation(likeVideoRef(dcOrVars, vars));
}

export const getMySavedVideosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMySavedVideos');
}
getMySavedVideosRef.operationName = 'GetMySavedVideos';

export function getMySavedVideos(dc) {
  return executeQuery(getMySavedVideosRef(dc));
}

