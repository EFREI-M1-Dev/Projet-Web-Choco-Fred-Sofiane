/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: Date; output: Date; }
};

/** Input type for creating a new message */
export type AddMessageJobInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['Float']['input'];
  userId: Scalars['Float']['input'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  access_token: Scalars['String']['output'];
  user: PickedUser;
};

/** Conversation */
export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Input type for creating a user */
export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

/** HealthCheck */
export type HealthCheck = {
  __typename?: 'HealthCheck';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Message */
export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  conversationId: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addConversation: Conversation;
  addMessageJob: Scalars['String']['output'];
  createUser: User;
  deleteConversation: Conversation;
  deleteMessage: Message;
  deleteUser: User;
  editMessageContent: Message;
  joinConversation: User;
  login: AuthPayload;
  updateConversation: Conversation;
};


export type MutationAddConversationArgs = {
  name: Scalars['String']['input'];
};


export type MutationAddMessageJobArgs = {
  data: AddMessageJobInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteConversationArgs = {
  id: Scalars['Float']['input'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['Float']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float']['input'];
};


export type MutationEditMessageContentArgs = {
  content: Scalars['String']['input'];
  id: Scalars['Float']['input'];
};


export type MutationJoinConversationArgs = {
  conversationId: Scalars['Float']['input'];
  userId: Scalars['Float']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationUpdateConversationArgs = {
  id: Scalars['Float']['input'];
  name: Scalars['String']['input'];
};

export type PickedUser = {
  __typename?: 'PickedUser';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  conversation: Conversation;
  findConversations: Array<Conversation>;
  findMessagesByConversationId: Array<Message>;
  findOneById: User;
  healthCheck: HealthCheck;
  message: Message;
  profile: User;
};


export type QueryConversationArgs = {
  id: Scalars['Float']['input'];
};


export type QueryFindConversationsArgs = {
  id: Scalars['Float']['input'];
};


export type QueryFindMessagesByConversationIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryFindOneByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryHealthCheckArgs = {
  id: Scalars['String']['input'];
};


export type QueryMessageArgs = {
  id: Scalars['Float']['input'];
};

/** User */
export type User = {
  __typename?: 'User';
  conversations: Maybe<Array<Conversation>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', access_token: string, user: { __typename?: 'PickedUser', id: number, username: string, email: string } } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', profile: { __typename?: 'User', id: string, username: string, email: string } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"access_token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetProfileQuery, GetProfileQueryVariables>;