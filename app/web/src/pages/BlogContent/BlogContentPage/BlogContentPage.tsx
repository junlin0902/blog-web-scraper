import BlogContentCell from 'src/components/BlogContent/BlogContentCell'

type BlogContentPageProps = {
  id: number
}

const BlogContentPage = ({ id }: BlogContentPageProps) => {
  return <BlogContentCell id={id} />
}

export default BlogContentPage
