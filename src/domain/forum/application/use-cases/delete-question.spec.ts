import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let sut: DeleteQuestionUseCase
let inMemoryQuestionRepository: InMemoryQuestionRepository

describe('Delete a question use case', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(newQuestion)
    const { isRight, value } = await sut.execute({
      authorId: newQuestion.authorId,
      questionId: newQuestion.id,
    })

    expect(isRight()).toBeTruthy()
    expect(value).toEqual({})
  })

  it('should not be able to delete a non existing question', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      questionId: new UniqueEntityId('question-1'),
    })

    expect(isLeft()).toBe(true)
    expect(value).instanceOf(ResouceNotFoundError)
  })

  it('should not be able to delete a question with different authorId', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryQuestionRepository.create(newQuestion)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      questionId: newQuestion.id,
    })

    expect(isLeft()).toBe(true)
    expect(value).instanceOf(NotAllowedError)
  })
})
