import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

let sut: DeleteAnswerUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository

describe('Delete a answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be possible to delete an answer', async () => {
    const answer = makeAnswer()
    await inMemoryAnswerRepository.create(answer)

    const result = await sut.execute({
      authorId: answer.authorId,
      answerId: answer.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({})
  })

  it('should not be able to delete a non existing answer', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerId: new UniqueEntityId('answer-1'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ResouceNotFoundError)
  })

  it('should not be able to delete a answer with different authorId', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      answerId: newAnswer.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(NotAllowedError)
  })
})
