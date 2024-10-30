import type {
  EditBlogContentById,
  UpdateBlogContentInput,
  UpdateBlogContentMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import BlogContentForm from 'src/components/BlogContent/BlogContentForm'

export const QUERY: TypedDocumentNode<EditBlogContentById> = gql`
  query EditBlogContentById($id: Int!) {
    blogContent: blogContent(id: $id) {
      id
      head
      content
      link
      createdAt
    }
  }
`

const UPDATE_BLOG_CONTENT_MUTATION: TypedDocumentNode<
  EditBlogContentById,
  UpdateBlogContentMutationVariables
> = gql`
  mutation UpdateBlogContentMutation(
    $id: Int!
    $input: UpdateBlogContentInput!
  ) {
    updateBlogContent(id: $id, input: $input) {
      id
      head
      content
      link
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  blogContent,
}: CellSuccessProps<EditBlogContentById>) => {
  const [updateBlogContent, { loading, error }] = useMutation(
    UPDATE_BLOG_CONTENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('BlogContent updated')
        navigate(routes.blogContents())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateBlogContentInput,
    id: EditBlogContentById['blogContent']['id']
  ) => {
    updateBlogContent({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit BlogContent {blogContent?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <BlogContentForm
          blogContent={blogContent}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
