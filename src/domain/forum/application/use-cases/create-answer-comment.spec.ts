import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { CreateAnswerCommentUseCase } from './create-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/in-memory-repository/in-memory-answer-comments-repository'

let sut: CreateAnswerCommentUseCase
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

describe('Create a answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CreateAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be possible to create a comment in a answer', async () => {
    const { isRight, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerId: new UniqueEntityId('answer-1'),
      content: 'is this a answer comment?',
    })

    expect(isRight()).toBeTruthy()
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          content: 'is this a answer comment?',
        }),
      }),
    )
  })
})
