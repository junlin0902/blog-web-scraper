import type {
  FindBlogContentById,
  FindBlogContentByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import BlogContent from 'src/components/BlogContent/BlogContent'

export const QUERY: TypedDocumentNode<
  FindBlogContentById,
  FindBlogContentByIdVariables
> = gql`
  query FindBlogContentById($id: Int!) {
    blogContent: blogContent(id: $id) {
      id
      head
      content
      link
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>BlogContent not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindBlogContentByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  blogContent,
}: CellSuccessProps<FindBlogContentById, FindBlogContentByIdVariables>) => {
  return <BlogContent blogContent={blogContent} />
}
