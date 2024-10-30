import type { BlogContent } from '@prisma/client'

import {
  blogContents,
  blogContent,
  createBlogContent,
  updateBlogContent,
  deleteBlogContent,
} from './blogContents'
import type { StandardScenario } from './blogContents.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('blogContents', () => {
  scenario('returns all blogContents', async (scenario: StandardScenario) => {
    const result = await blogContents()

    expect(result.length).toEqual(Object.keys(scenario.blogContent).length)
  })

  scenario(
    'returns a single blogContent',
    async (scenario: StandardScenario) => {
      const result = await blogContent({ id: scenario.blogContent.one.id })

      expect(result).toEqual(scenario.blogContent.one)
    }
  )

  scenario('creates a blogContent', async () => {
    const result = await createBlogContent({
      input: { head: 'String', content: 'String', link: 'String' },
    })

    expect(result.head).toEqual('String')
    expect(result.content).toEqual('String')
    expect(result.link).toEqual('String')
  })

  scenario('updates a blogContent', async (scenario: StandardScenario) => {
    const original = (await blogContent({
      id: scenario.blogContent.one.id,
    })) as BlogContent
    const result = await updateBlogContent({
      id: original.id,
      input: { head: 'String2' },
    })

    expect(result.head).toEqual('String2')
  })

  scenario('deletes a blogContent', async (scenario: StandardScenario) => {
    const original = (await deleteBlogContent({
      id: scenario.blogContent.one.id,
    })) as BlogContent
    const result = await blogContent({ id: original.id })

    expect(result).toEqual(null)
  })
})
