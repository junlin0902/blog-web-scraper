import type {
  DeleteBlogContentMutation,
  DeleteBlogContentMutationVariables,
  FindBlogContentById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_BLOG_CONTENT_MUTATION: TypedDocumentNode<
  DeleteBlogContentMutation,
  DeleteBlogContentMutationVariables
> = gql`
  mutation DeleteBlogContentMutation($id: Int!) {
    deleteBlogContent(id: $id) {
      id
    }
  }
`

interface Props {
  blogContent: NonNullable<FindBlogContentById['blogContent']>
}

const BlogContent = ({ blogContent }: Props) => {
  const [deleteBlogContent] = useMutation(DELETE_BLOG_CONTENT_MUTATION, {
    onCompleted: () => {
      toast.success('BlogContent deleted')
      navigate(routes.blogContents())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteBlogContentMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete blogContent ' + id + '?')) {
      deleteBlogContent({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            BlogContent {blogContent.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{blogContent.id}</td>
            </tr>
            <tr>
              <th>Head</th>
              <td>{blogContent.head}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{blogContent.content}</td>
            </tr>
            <tr>
              <th>Link</th>
              <td>{blogContent.link}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(blogContent.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editBlogContent({ id: blogContent.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(blogContent.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default BlogContent
