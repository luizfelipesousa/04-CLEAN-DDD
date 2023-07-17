import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerCommentsRepository } from 'test/in-memory-repository/in-memory-answer-comments-repository'
import { DeleteAnswerCommentsUseCase } from './delete-answer-comments'
import { makeAnswerComments } from 'test/factories/make-answer-comments'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

let sut: DeleteAnswerCommentsUseCase
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

describe('Delete a answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answerComments', async () => {
    const newAnswerComments = makeAnswerComments()
    await inMemoryAnswerCommentsRepository.create(newAnswerComments)
    const { isRight, value } = await sut.execute({
      authorId: newAnswerComments.authorId,
      answerCommentsId: newAnswerComments.id,
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual({})
  })

  it('should not be able to delete a non existing answerComments', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerCommentsId: new UniqueEntityId('answerComments-1'),
    })

    expect(isLeft()).toBe(true)
    expect(value).toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be able to delete a answerComments with different authorId', async () => {
    const newAnswerComments = makeAnswerComments({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryAnswerCommentsRepository.create(newAnswerComments)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      answerCommentsId: newAnswerComments.id,
    })

    expect(isLeft()).toBe(true)
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
