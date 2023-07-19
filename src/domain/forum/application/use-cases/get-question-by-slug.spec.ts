import { beforeEach, describe, expect, it } from 'vitest'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from 'test/in-memory-repository/in-memory-question-attachment-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug use case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it('should be possible to get a question by passing a slug', async () => {
    const createdQuestion = makeQuestion({
      title: 'Example of a slug!!',
    })

    await inMemoryQuestionRepository.create(createdQuestion)

    const { value } = await sut.execute({ slug: 'example-of-a-slug' })
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          slug: expect.objectContaining({ value: 'example-of-a-slug' }),
        }),
      }),
    )
  })
})
