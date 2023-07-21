import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'
import { InMemoryAnswerAttachmentRepository } from 'test/in-memory-repository/in-memory-answer-attachment-repository'
import { Answer } from '../../enterprise/entities/answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let sut: EditAnswerUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

describe('Edit a answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(newAnswer)
    const { isRight, value } = await sut.execute({
      authorId: newAnswer.authorId,
      answerId: newAnswer.id,
      content: 'new content',
      attachmentsId: ['1', '3'],
    })

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: newAnswer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: newAnswer.id,
      }),
    )

    expect(isRight()).toBeTruthy()
    expect(value).toEqual(expect.objectContaining({ content: 'new content' }))

    if (value instanceof Answer) {
      expect(value.attachments.currentItems).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: new UniqueEntityId('1'),
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: new UniqueEntityId('3'),
          }),
        }),
      ])
    }
  })

  it('should not be able to edit a non existing answer', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerId: new UniqueEntityId('answer-1'),
      content: 'new content',
      attachmentsId: [],
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
      attachmentsId: [],
    })
    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
