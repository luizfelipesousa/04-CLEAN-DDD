import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/in-memory-repository/in-memory-question-attachment-repository'

let sut: CreateQuestionUseCase
let inMemoryQuestionRepository: InMemoryQuestionRepository

describe('Create a question use case', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      new InMemoryQuestionAttachmentRepository(),
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be possible to create a question', async () => {
    const { value, isRight } = await sut.execute({
      authorId: new UniqueEntityId('1'),
      title: 'question title',
      content: 'is this a question?',
      attachmentIds: ['1', '2'],
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          content: 'is this a question?',
        }),
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
