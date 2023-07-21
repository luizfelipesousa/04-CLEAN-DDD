import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerCommentsRepository } from 'test/in-memory-repository/in-memory-answer-comments-repository'
import { EditAnswerCommentsUseCase } from './edit-answer-comments'
import { makeAnswerComments } from 'test/factories/make-answer-comments'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'
import { NotAllowedError } from '@/core/error/not-allowed-error'

let sut: EditAnswerCommentsUseCase
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

describe('Edit a answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new EditAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to edit a answerComments', async () => {
    const newAnswerComments = makeAnswerComments()
    await inMemoryAnswerCommentsRepository.create(newAnswerComments)
    const { isRight, value } = await sut.execute({
      authorId: newAnswerComments.authorId,
      answerCommentsId: newAnswerComments.id,
      content: 'new content',
    })

    expect(isRight).toBeTruthy()
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({ content: 'new content' }),
      }),
    )
  })

  it('should not be able to edit a non existing answerComments', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerCommentsId: new UniqueEntityId('answerComments-1'),
      content: 'new content',
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be able to edit a answerComments with different authorId', async () => {
    const newAnswerComments = makeAnswerComments({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryAnswerCommentsRepository.create(newAnswerComments)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      answerCommentsId: newAnswerComments.id,
      content: 'new content',
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
