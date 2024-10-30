import type { Prisma, BlogContent } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BlogContentCreateArgs>({
  blogContent: {
    one: { data: { head: 'String', content: 'String', link: 'String' } },
    two: { data: { head: 'String', content: 'String', link: 'String' } },
  },
})

export type StandardScenario = ScenarioData<BlogContent, 'blogContent'>
