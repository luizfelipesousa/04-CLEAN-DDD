import { beforeEach, describe, expect, it } from 'vitest'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { InMemoryAnswerCommentsRepository } from 'test/in-memory-repository/in-memory-answer-comments-repository'
import { makeAnswerComments } from 'test/factories/make-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answers comments use case', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)

    for (let i = 1; i <= 25; i++) {
      const createdAnswerComment = makeAnswerComments({
        content: `this is an answer comment ${i}`,
        authorId: new UniqueEntityId('author-test'),
        answerId: new UniqueEntityId('comment-test'),
      })
      await inMemoryAnswerCommentsRepository.create(createdAnswerComment)
    }
  })

  it('should be able to get a list of comments from a answer', async () => {
    const { value } = await sut.execute({
      answerId: 'comment-test',
      page: 2,
    })

    expect(value).toHaveLength(5)
    if (value) {
      expect(value[0]).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            content: 'this is an answer comment 21',
          }),
        }),
      )
    }
  })
})
