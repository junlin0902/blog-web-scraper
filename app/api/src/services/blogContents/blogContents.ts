import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const blogContents: QueryResolvers['blogContents'] = () => {
  return db.blogContent.findMany()
}

export const blogContent: QueryResolvers['blogContent'] = ({ id }) => {
  return db.blogContent.findUnique({
    where: { id },
  })
}

export const createBlogContent: MutationResolvers['createBlogContent'] = ({
  input,
}) => {
  return db.blogContent.create({
    data: input,
  })
}

export const updateBlogContent: MutationResolvers['updateBlogContent'] = ({
  id,
  input,
}) => {
  return db.blogContent.update({
    data: input,
    where: { id },
  })
}

export const deleteBlogContent: MutationResolvers['deleteBlogContent'] = ({
  id,
}) => {
  return db.blogContent.delete({
    where: { id },
  })
}
