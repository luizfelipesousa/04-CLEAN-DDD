import { beforeEach, describe, expect, it } from 'vitest'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { InMemoryQuestionCommentsRepository } from 'test/in-memory-repository/in-memory-question-comments-repository'
import { makeQuestionComments } from 'test/factories/make-question-comments'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch questions comments use case', () => {
  beforeEach(async () => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)

    for (let i = 1; i <= 25; i++) {
      const createdQuestionComment = makeQuestionComments({
        content: `this is an question comment ${i}`,
        authorId: new UniqueEntityId('author-test'),
        questionId: new UniqueEntityId('comment-test'),
      })
      await inMemoryQuestionCommentsRepository.create(createdQuestionComment)
    }
  })

  it('should be able to get a list of comments from a question', async () => {
    const { value } = await sut.execute({
      questionId: 'comment-test',
      page: 2,
    })

    expect(value).toHaveLength(5)
    if (value) {
      expect(value[0]).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            content: 'this is an question comment 21',
          }),
        }),
      )
    }
  })
})
