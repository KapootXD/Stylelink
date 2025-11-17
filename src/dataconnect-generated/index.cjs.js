const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'stylelink',
  location: 'us-south1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const getVideosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVideos');
}
getVideosRef.operationName = 'GetVideos';
exports.getVideosRef = getVideosRef;

exports.getVideos = function getVideos(dc) {
  return executeQuery(getVideosRef(dc));
};

const likeVideoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LikeVideo', inputVars);
}
likeVideoRef.operationName = 'LikeVideo';
exports.likeVideoRef = likeVideoRef;

exports.likeVideo = function likeVideo(dcOrVars, vars) {
  return executeMutation(likeVideoRef(dcOrVars, vars));
};

const getMySavedVideosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMySavedVideos');
}
getMySavedVideosRef.operationName = 'GetMySavedVideos';
exports.getMySavedVideosRef = getMySavedVideosRef;

exports.getMySavedVideos = function getMySavedVideos(dc) {
  return executeQuery(getMySavedVideosRef(dc));
};
