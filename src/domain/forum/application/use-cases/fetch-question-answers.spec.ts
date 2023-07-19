import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { InMemoryAnswerAttachmentRepository } from 'test/in-memory-repository/in-memory-answer-attachment-repository'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch  recent answer use case', () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository)

    for (let i = 1; i <= 25; i++) {
      const createdAnswer = makeAnswer({
        content: `this is an answer ${i}`,
        questionId: new UniqueEntityId('question-test'),
      })

      await inMemoryAnswerRepository.create(createdAnswer)
    }
  })

  it('should be able to get a list of recent answers', async () => {
    const { value } = await sut.execute({
      questionId: 'question-test',
      page: 2,
    })

    expect(value).toHaveLength(5)
    if (value) {
      expect(value[0]).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            content: 'this is an answer 21',
          }),
        }),
      )
    }
  })
})
