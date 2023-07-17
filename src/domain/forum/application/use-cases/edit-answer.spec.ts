import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let sut: EditAnswerUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository

describe('Edit a answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(newAnswer)
    const { isRight, value } = await sut.execute({
      authorId: newAnswer.authorId,
      answerId: newAnswer.id,
      content: 'new content',
    })

    expect(isRight()).toBeTruthy()
    expect(value).toEqual(expect.objectContaining({ content: 'new content' }))
  })

  it('should not be able to edit a non existing answer', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerId: new UniqueEntityId('answer-1'),
      content: 'new content',
    })
    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be able to edit a answer with different authorId', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryAnswerRepository.create(newAnswer)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      answerId: newAnswer.id,
      content: 'new content',
    })
    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
