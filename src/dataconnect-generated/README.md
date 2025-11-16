# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetVideos*](#getvideos)
  - [*GetMySavedVideos*](#getmysavedvideos)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*LikeVideo*](#likevideo)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetVideos
You can execute the `GetVideos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVideos(): QueryPromise<GetVideosData, undefined>;

interface GetVideosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVideosData, undefined>;
}
export const getVideosRef: GetVideosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVideos(dc: DataConnect): QueryPromise<GetVideosData, undefined>;

interface GetVideosRef {
  ...
  (dc: DataConnect): QueryRef<GetVideosData, undefined>;
}
export const getVideosRef: GetVideosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVideosRef:
```typescript
const name = getVideosRef.operationName;
console.log(name);
```

### Variables
The `GetVideos` query has no variables.
### Return Type
Recall that executing the `GetVideos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVideosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVideosData {
  videos: ({
    id: UUIDString;
    caption: string;
    videoUrl: string;
  } & Video_Key)[];
}
```
### Using `GetVideos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVideos } from '@dataconnect/generated';


// Call the `getVideos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVideos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVideos(dataConnect);

console.log(data.videos);

// Or, you can use the `Promise` API.
getVideos().then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

### Using `GetVideos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVideosRef } from '@dataconnect/generated';


// Call the `getVideosRef()` function to get a reference to the query.
const ref = getVideosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVideosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.videos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

## GetMySavedVideos
You can execute the `GetMySavedVideos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMySavedVideos(): QueryPromise<GetMySavedVideosData, undefined>;

interface GetMySavedVideosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMySavedVideosData, undefined>;
}
export const getMySavedVideosRef: GetMySavedVideosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMySavedVideos(dc: DataConnect): QueryPromise<GetMySavedVideosData, undefined>;

interface GetMySavedVideosRef {
  ...
  (dc: DataConnect): QueryRef<GetMySavedVideosData, undefined>;
}
export const getMySavedVideosRef: GetMySavedVideosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMySavedVideosRef:
```typescript
const name = getMySavedVideosRef.operationName;
console.log(name);
```

### Variables
The `GetMySavedVideos` query has no variables.
### Return Type
Recall that executing the `GetMySavedVideos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMySavedVideosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMySavedVideosData {
  savedVideos: ({
    video: {
      id: UUIDString;
      caption: string;
      videoUrl: string;
    } & Video_Key;
  })[];
}
```
### Using `GetMySavedVideos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMySavedVideos } from '@dataconnect/generated';


// Call the `getMySavedVideos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMySavedVideos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMySavedVideos(dataConnect);

console.log(data.savedVideos);

// Or, you can use the `Promise` API.
getMySavedVideos().then((response) => {
  const data = response.data;
  console.log(data.savedVideos);
});
```

### Using `GetMySavedVideos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMySavedVideosRef } from '@dataconnect/generated';


// Call the `getMySavedVideosRef()` function to get a reference to the query.
const ref = getMySavedVideosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMySavedVideosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.savedVideos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.savedVideos);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## LikeVideo
You can execute the `LikeVideo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
likeVideo(vars: LikeVideoVariables): MutationPromise<LikeVideoData, LikeVideoVariables>;

interface LikeVideoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LikeVideoVariables): MutationRef<LikeVideoData, LikeVideoVariables>;
}
export const likeVideoRef: LikeVideoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
likeVideo(dc: DataConnect, vars: LikeVideoVariables): MutationPromise<LikeVideoData, LikeVideoVariables>;

interface LikeVideoRef {
  ...
  (dc: DataConnect, vars: LikeVideoVariables): MutationRef<LikeVideoData, LikeVideoVariables>;
}
export const likeVideoRef: LikeVideoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the likeVideoRef:
```typescript
const name = likeVideoRef.operationName;
console.log(name);
```

### Variables
The `LikeVideo` mutation requires an argument of type `LikeVideoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LikeVideoVariables {
  videoId: UUIDString;
}
```
### Return Type
Recall that executing the `LikeVideo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LikeVideoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LikeVideoData {
  like_insert: Like_Key;
}
```
### Using `LikeVideo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, likeVideo, LikeVideoVariables } from '@dataconnect/generated';

// The `LikeVideo` mutation requires an argument of type `LikeVideoVariables`:
const likeVideoVars: LikeVideoVariables = {
  videoId: ..., 
};

// Call the `likeVideo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await likeVideo(likeVideoVars);
// Variables can be defined inline as well.
const { data } = await likeVideo({ videoId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await likeVideo(dataConnect, likeVideoVars);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
likeVideo(likeVideoVars).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

### Using `LikeVideo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, likeVideoRef, LikeVideoVariables } from '@dataconnect/generated';

// The `LikeVideo` mutation requires an argument of type `LikeVideoVariables`:
const likeVideoVars: LikeVideoVariables = {
  videoId: ..., 
};

// Call the `likeVideoRef()` function to get a reference to the mutation.
const ref = likeVideoRef(likeVideoVars);
// Variables can be defined inline as well.
const ref = likeVideoRef({ videoId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = likeVideoRef(dataConnect, likeVideoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

