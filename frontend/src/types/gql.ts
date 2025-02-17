/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n        mutation Register($data: CreateUserInput!) {\n          createUser(data: $data) {\n            id\n            email\n            username\n            password\n          }\n        }\n    ": types.RegisterDocument,
    "\n  query FindConversations($id: Float!) {\n    findConversations(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      ownerId\n    }\n  }\n": types.FindConversationsDocument,
    "\n  query FindConversationById($id: Float!) {\n    conversation(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      ownerId\n    }\n  }\n": types.FindConversationByIdDocument,
    "\n  query FindMessagesByConversationId($id: Float!) {\n    findMessagesByConversationId(id: $id) {\n      id\n      content\n      createdAt\n      updatedAt\n      conversationId\n      userId\n      deletedAt\n      user {\n        username\n      }\n    }\n  }\n": types.FindMessagesByConversationIdDocument,
    "\n  mutation AddMessageJob($data: AddMessageJobInput!) {\n    addMessageJob(data: $data)\n  }\n": types.AddMessageJobDocument,
    "\n    mutation AddConversation($conversationName: String!) {\n        addConversation(name: $conversationName) {\n            id\n            name\n            createdAt\n            updatedAt\n            ownerId\n        }\n    }\n": types.AddConversationDocument,
    "\n    mutation DeleteConversation($id: Float!) {\n        deleteConversation(id: $id) {\n            id\n            name\n        }\n    }\n": types.DeleteConversationDocument,
    "\n    mutation JoinConversation($conversationId: Float!) {\n        joinConversation(conversationId: $conversationId) {\n            id\n            name\n            createdAt\n            updatedAt\n            ownerId\n        }\n    }\n": types.JoinConversationDocument,
    "\n    mutation Login($email: String!, $password: String!) {\n        login(data: { email: $email, password: $password }) {\n            user {\n                id\n                username\n                email\n            }\n            access_token\n            refresh_token\n        }\n    }\n": types.LoginDocument,
    "\n    mutation RefreshToken($refreshToken: String!) {\n        refreshTokens(refreshToken: $refreshToken) {\n            access_token\n            refresh_token\n        }\n    }\n": types.RefreshTokenDocument,
    "\n    query GetProfile {\n        profile {\n            id\n            username\n            email\n        }\n    }\n": types.GetProfileDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n        mutation Register($data: CreateUserInput!) {\n          createUser(data: $data) {\n            id\n            email\n            username\n            password\n          }\n        }\n    "): (typeof documents)["\n        mutation Register($data: CreateUserInput!) {\n          createUser(data: $data) {\n            id\n            email\n            username\n            password\n          }\n        }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FindConversations($id: Float!) {\n    findConversations(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      ownerId\n    }\n  }\n"): (typeof documents)["\n  query FindConversations($id: Float!) {\n    findConversations(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      ownerId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FindConversationById($id: Float!) {\n    conversation(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      ownerId\n    }\n  }\n"): (typeof documents)["\n  query FindConversationById($id: Float!) {\n    conversation(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      ownerId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FindMessagesByConversationId($id: Float!) {\n    findMessagesByConversationId(id: $id) {\n      id\n      content\n      createdAt\n      updatedAt\n      conversationId\n      userId\n      deletedAt\n      user {\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query FindMessagesByConversationId($id: Float!) {\n    findMessagesByConversationId(id: $id) {\n      id\n      content\n      createdAt\n      updatedAt\n      conversationId\n      userId\n      deletedAt\n      user {\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddMessageJob($data: AddMessageJobInput!) {\n    addMessageJob(data: $data)\n  }\n"): (typeof documents)["\n  mutation AddMessageJob($data: AddMessageJobInput!) {\n    addMessageJob(data: $data)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation AddConversation($conversationName: String!) {\n        addConversation(name: $conversationName) {\n            id\n            name\n            createdAt\n            updatedAt\n            ownerId\n        }\n    }\n"): (typeof documents)["\n    mutation AddConversation($conversationName: String!) {\n        addConversation(name: $conversationName) {\n            id\n            name\n            createdAt\n            updatedAt\n            ownerId\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation DeleteConversation($id: Float!) {\n        deleteConversation(id: $id) {\n            id\n            name\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteConversation($id: Float!) {\n        deleteConversation(id: $id) {\n            id\n            name\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation JoinConversation($conversationId: Float!) {\n        joinConversation(conversationId: $conversationId) {\n            id\n            name\n            createdAt\n            updatedAt\n            ownerId\n        }\n    }\n"): (typeof documents)["\n    mutation JoinConversation($conversationId: Float!) {\n        joinConversation(conversationId: $conversationId) {\n            id\n            name\n            createdAt\n            updatedAt\n            ownerId\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation Login($email: String!, $password: String!) {\n        login(data: { email: $email, password: $password }) {\n            user {\n                id\n                username\n                email\n            }\n            access_token\n            refresh_token\n        }\n    }\n"): (typeof documents)["\n    mutation Login($email: String!, $password: String!) {\n        login(data: { email: $email, password: $password }) {\n            user {\n                id\n                username\n                email\n            }\n            access_token\n            refresh_token\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RefreshToken($refreshToken: String!) {\n        refreshTokens(refreshToken: $refreshToken) {\n            access_token\n            refresh_token\n        }\n    }\n"): (typeof documents)["\n    mutation RefreshToken($refreshToken: String!) {\n        refreshTokens(refreshToken: $refreshToken) {\n            access_token\n            refresh_token\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetProfile {\n        profile {\n            id\n            username\n            email\n        }\n    }\n"): (typeof documents)["\n    query GetProfile {\n        profile {\n            id\n            username\n            email\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;