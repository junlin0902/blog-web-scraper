import type { FindBlogContents, FindBlogContentsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import BlogContents from 'src/components/BlogContent/BlogContents'

export const QUERY: TypedDocumentNode<
  FindBlogContents,
  FindBlogContentsVariables
> = gql`
  query FindBlogContents {
    blogContents {
      id
      head
      content
      link
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No blogContents yet.{' '}
      <Link to={routes.newBlogContent()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindBlogContents>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  blogContents,
}: CellSuccessProps<FindBlogContents, FindBlogContentsVariables>) => {
  return <BlogContents blogContents={blogContents} />
}
