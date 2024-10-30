export const schema = gql`
  type BlogContent {
    id: Int!
    head: String!
    content: String!
    link: String!
    createdAt: DateTime!
  }

  type Query {
    blogContents: [BlogContent!]! @requireAuth
    blogContent(id: Int!): BlogContent @requireAuth
  }

  input CreateBlogContentInput {
    head: String!
    content: String!
    link: String!
  }

  input UpdateBlogContentInput {
    head: String
    content: String
    link: String
  }

  type Mutation {
    createBlogContent(input: CreateBlogContentInput!): BlogContent! @requireAuth
    updateBlogContent(id: Int!, input: UpdateBlogContentInput!): BlogContent!
      @requireAuth
    deleteBlogContent(id: Int!): BlogContent! @requireAuth
  }
`
