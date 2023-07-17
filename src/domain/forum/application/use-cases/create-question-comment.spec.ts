import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { CreateQuestionCommentUseCase } from './create-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/in-memory-repository/in-memory-question-comments-repository'

let sut: CreateQuestionCommentUseCase
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

describe('Create a question comment use case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new CreateQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be possible to create a comment in a question', async () => {
    const { isRight, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      questionId: new UniqueEntityId('question-1'),
      content: 'is this a question comment?',
    })

    expect(isRight()).toBeTruthy()
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          content: 'is this a question comment?',
        }),
      }),
    )
  })
})
