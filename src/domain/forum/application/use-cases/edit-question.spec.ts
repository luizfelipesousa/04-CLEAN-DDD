import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let sut: EditQuestionUseCase
let inMemoryQuestionRepository: InMemoryQuestionRepository

describe('Edit a question use case', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(newQuestion)
    const { value } = await sut.execute({
      authorId: newQuestion.authorId,
      questionId: newQuestion.id,
      content: 'new content',
      title: 'new title',
    })

    expect(value).toEqual(
      expect.objectContaining({ title: 'new title', content: 'new content' }),
    )
  })

  it('should not be able to edit a non existing question', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      questionId: new UniqueEntityId('question-1'),
      content: 'new content',
      title: 'new title',
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
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
