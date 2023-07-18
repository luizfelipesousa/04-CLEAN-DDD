import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryQuestionAttachmentRepository } from 'test/in-memory-repository/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { Question } from '../../enterprise/entities/question'

let sut: EditQuestionUseCase
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository

describe('Edit a question use case', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(newQuestion)
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('1'),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('2'),
        questionId: newQuestion.id,
      }),
    )

    const { value } = await sut.execute({
      authorId: newQuestion.authorId,
      questionId: newQuestion.id,
      content: 'new content',
      title: 'new title',
      attachmentIds: ['1', '3'],
    })

    expect(value).toEqual(
      expect.objectContaining({ title: 'new title', content: 'new content' }),
    )

    if (value instanceof Question) {
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

  it('should not be able to edit a non existing question', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      questionId: new UniqueEntityId('question-1'),
      content: 'new content',
      title: 'new title',
      attachmentIds: [],
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be able to edit a question with different authorId', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryQuestionRepository.create(newQuestion)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      questionId: newQuestion.id,
      content: 'new content',
      title: 'new title',
      attachmentIds: [],
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
