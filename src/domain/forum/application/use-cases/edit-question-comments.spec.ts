import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryQuestionCommentsRepository } from 'test/in-memory-repository/in-memory-question-comments-repository'
import { EditQuestionCommentsUseCase } from './edit-question-comments'
import { makeQuestionComments } from 'test/factories/make-question-comments'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'

let sut: EditQuestionCommentsUseCase
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

describe('Edit a question comment use case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new EditQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to edit a questionComments', async () => {
    const newQuestionComments = makeQuestionComments()
    await inMemoryQuestionCommentsRepository.create(newQuestionComments)
    const { value } = await sut.execute({
      authorId: newQuestionComments.authorId,
      questionCommentsId: newQuestionComments.id,
      content: 'new content',
    })

    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({ content: 'new content' }),
      }),
    )
  })

  it('should not be able to edit a non existing questionComments', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      questionCommentsId: new UniqueEntityId('questionComments-1'),
      content: 'new content',
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be able to edit a questionComments with different authorId', async () => {
    const newQuestionComments = makeQuestionComments({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMemoryQuestionCommentsRepository.create(newQuestionComments)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      questionCommentsId: newQuestionComments.id,
      content: 'new content',
    })

    expect(isLeft()).toBeTruthy()
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
