import { beforeEach, describe, expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/in-memory-repository/in-memory-answer-attachment-repository'

let sut: AnswerQuestionUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

describe('Create an answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be possible to answer a question', async () => {
    const { value, isRight } = await sut.execute({
      content: 'Nova Resposta',
      instructorId: new UniqueEntityId('1'),
      questionId: new UniqueEntityId('2'),
      attachmentIds: ['1', '2'],
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({ content: 'Nova Resposta' }),
      }),
    )

    expect(value?.attachments.currentItems).toEqual([
      expect.objectContaining({
        props: expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      }),
    ])
  })
})
