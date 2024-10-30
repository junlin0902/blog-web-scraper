import EditBlogContentCell from 'src/components/BlogContent/EditBlogContentCell'

type BlogContentPageProps = {
  id: number
}

const EditBlogContentPage = ({ id }: BlogContentPageProps) => {
  return <EditBlogContentCell id={id} />
}

export default EditBlogContentPage
