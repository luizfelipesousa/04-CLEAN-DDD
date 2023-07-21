import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { InMemoryAnswerAttachmentRepository } from 'test/in-memory-repository/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let sut: DeleteAnswerUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository

describe('Delete a answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be possible to delete an answer', async () => {
    const answer = makeAnswer()
    await inMemoryAnswerRepository.create(answer)
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: answer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: answer.id,
      }),
    )

    const result = await sut.execute({
      authorId: answer.authorId,
      answerId: answer.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({})
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
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
