import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent question use case', () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)

    for (let i = 1; i <= 25; i++) {
      vi.setSystemTime(new Date(2023, 0, i, 0))

      const createdQuestion = makeQuestion({
        title: 'Example of a slug!!',
      })

      await inMemoryQuestionRepository.create(createdQuestion)
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get a list of recent questions', async () => {
    const { value } = await sut.execute({ page: 2 })

    expect(value).toHaveLength(5)
    if (value) {
      expect(value[4]).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            createdAt: new Date(2023, 0, 1, 0),
          }),
        }),
      )
    }
  })
})
