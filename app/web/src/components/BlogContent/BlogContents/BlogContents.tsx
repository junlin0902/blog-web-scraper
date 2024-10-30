import type {
  DeleteBlogContentMutation,
  DeleteBlogContentMutationVariables,
  FindBlogContents,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/BlogContent/BlogContentsCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const BlogContentsList = ({ blogContents }: FindBlogContents) => {
  const [deleteBlogContent] = useMutation(DELETE_BLOG_CONTENT_MUTATION, {
    onCompleted: () => {
      toast.success('BlogContent deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteBlogContentMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete blogContent ' + id + '?')) {
      deleteBlogContent({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Head</th>
            <th>Content</th>
            <th>Link</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {blogContents.map((blogContent) => (
            <tr key={blogContent.id}>
              <td>{truncate(blogContent.id)}</td>
              <td>{truncate(blogContent.head)}</td>
              <td>{truncate(blogContent.content)}</td>
              <td>{truncate(blogContent.link)}</td>
              <td>{timeTag(blogContent.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.blogContent({ id: blogContent.id })}
                    title={'Show blogContent ' + blogContent.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editBlogContent({ id: blogContent.id })}
                    title={'Edit blogContent ' + blogContent.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete blogContent ' + blogContent.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(blogContent.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BlogContentsList
