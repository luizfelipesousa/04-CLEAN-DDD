import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryQuestionCommentsRepository } from 'test/in-memory-repository/in-memory-question-comments-repository'
import { DeleteQuestionCommentsUseCase } from './delete-question-comments'
import { makeQuestionComments } from 'test/factories/make-question-comments'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let sut: DeleteQuestionCommentsUseCase
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

describe('Delete a questionComments comment use case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a questionComments', async () => {
    const newQuestionComments = makeQuestionComments()
    await inMemoryQuestionCommentsRepository.create(newQuestionComments)
    const { isRight, value } = await sut.execute({
      authorId: newQuestionComments.authorId,
      questionCommentsId: newQuestionComments.id,
    })
    expect(isRight()).toBe(true)
    expect(value).toEqual({})
  })

  it('should not be able to delete a non existing questionComments', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      questionCommentsId: new UniqueEntityId('questionComments-1'),
    })

    expect(isLeft()).toBe(true)
    expect(value).instanceOf(ResouceNotFoundError)
  })

  it('should not be able to delete a questionComments with different authorId', async () => {
    const newQuestionComments = makeQuestionComments({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryQuestionCommentsRepository.create(newQuestionComments)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      questionCommentsId: newQuestionComments.id,
    })

    expect(isLeft()).toBeTruthy()
    expect(value).instanceOf(NotAllowedError)
  })
})
