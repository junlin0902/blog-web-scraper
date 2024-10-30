import type {
  CreateBlogContentMutation,
  CreateBlogContentInput,
  CreateBlogContentMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import BlogContentForm from 'src/components/BlogContent/BlogContentForm'

const CREATE_BLOG_CONTENT_MUTATION: TypedDocumentNode<
  CreateBlogContentMutation,
  CreateBlogContentMutationVariables
> = gql`
  mutation CreateBlogContentMutation($input: CreateBlogContentInput!) {
    createBlogContent(input: $input) {
      id
    }
  }
`

const NewBlogContent = () => {
  const [createBlogContent, { loading, error }] = useMutation(
    CREATE_BLOG_CONTENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('BlogContent created')
        navigate(routes.blogContents())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateBlogContentInput) => {
    createBlogContent({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New BlogContent</h2>
      </header>
      <div className="rw-segment-main">
        <BlogContentForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewBlogContent
