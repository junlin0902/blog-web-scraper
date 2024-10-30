import { Prisma } from "@prisma/client"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: number;
  Byte: Buffer;
  Date: string;
  DateTime: string;
  File: File;
  JSON: Prisma.JsonValue;
  JSONObject: Prisma.JsonObject;
  Time: string;
};

export type BlogContent = {
  __typename?: 'BlogContent';
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  head: Scalars['String'];
  id: Scalars['Int'];
  link: Scalars['String'];
};

export type CreateBlogContentInput = {
  content: Scalars['String'];
  head: Scalars['String'];
  link: Scalars['String'];
};

export type CreatePostInput = {
  body: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBlogContent: BlogContent;
  createPost: Post;
  deleteBlogContent: BlogContent;
  deletePost: Post;
  updateBlogContent: BlogContent;
  updatePost: Post;
};


export type MutationcreateBlogContentArgs = {
  input: CreateBlogContentInput;
};


export type MutationcreatePostArgs = {
  input: CreatePostInput;
};


export type MutationdeleteBlogContentArgs = {
  id: Scalars['Int'];
};


export type MutationdeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationupdateBlogContentArgs = {
  id: Scalars['Int'];
  input: UpdateBlogContentInput;
};


export type MutationupdatePostArgs = {
  id: Scalars['Int'];
  input: UpdatePostInput;
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  title: Scalars['String'];
};

/** About the Redwood queries. */
export type Query = {
  __typename?: 'Query';
  blogContent?: Maybe<BlogContent>;
  blogContents: Array<BlogContent>;
  post?: Maybe<Post>;
  posts: Array<Post>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
};


/** About the Redwood queries. */
export type QueryblogContentArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QuerypostArgs = {
  id: Scalars['Int'];
};

/**
 * The RedwoodJS Root Schema
 *
 * Defines details about RedwoodJS such as the current user and version information.
 */
export type Redwood = {
  __typename?: 'Redwood';
  /** The current user. */
  currentUser?: Maybe<Scalars['JSON']>;
  /** The version of Prisma. */
  prismaVersion?: Maybe<Scalars['String']>;
  /** The version of Redwood. */
  version?: Maybe<Scalars['String']>;
};

export type UpdateBlogContentInput = {
  content?: InputMaybe<Scalars['String']>;
  head?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
};

export type UpdatePostInput = {
  body?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type DeleteBlogContentMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBlogContentMutation = { __typename?: 'Mutation', deleteBlogContent: { __typename?: 'BlogContent', id: number } };

export type FindBlogContentByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindBlogContentById = { __typename?: 'Query', blogContent?: { __typename?: 'BlogContent', id: number, head: string, content: string, link: string, createdAt: string } | null };

export type FindBlogContentsVariables = Exact<{ [key: string]: never; }>;


export type FindBlogContents = { __typename?: 'Query', blogContents: Array<{ __typename?: 'BlogContent', id: number, head: string, content: string, link: string, createdAt: string }> };

export type EditBlogContentByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EditBlogContentById = { __typename?: 'Query', blogContent?: { __typename?: 'BlogContent', id: number, head: string, content: string, link: string, createdAt: string } | null };

export type UpdateBlogContentMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateBlogContentInput;
}>;


export type UpdateBlogContentMutation = { __typename?: 'Mutation', updateBlogContent: { __typename?: 'BlogContent', id: number, head: string, content: string, link: string, createdAt: string } };

export type CreateBlogContentMutationVariables = Exact<{
  input: CreateBlogContentInput;
}>;


export type CreateBlogContentMutation = { __typename?: 'Mutation', createBlogContent: { __typename?: 'BlogContent', id: number } };

export type EditPostByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EditPostById = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, title: string, body: string, createdAt: string } | null };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'Post', id: number, title: string, body: string, createdAt: string } };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'Post', id: number } };

export type FindPostByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindPostById = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, title: string, body: string, createdAt: string } | null };

export type FindPostsVariables = Exact<{ [key: string]: never; }>;


export type FindPosts = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: number, title: string, body: string, createdAt: string }> };
