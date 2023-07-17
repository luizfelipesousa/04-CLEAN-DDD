import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionRepository } from 'test/in-memory-repository/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

let sut: ChooseQuestionBestAnswerUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository

describe('Choose question best answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await inMemoryQuestionRepository.create(newQuestion)
    await inMemoryAnswerRepository.create(newAnswer)

    const { value, isRight } = await sut.execute({
      authorId: newQuestion.authorId,
      answerId: newAnswer.id,
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({ bestAnswerId: newAnswer.id }),
      }),
    )
  })

  it('should not be able to choose a best question answer if answer does not exists', async () => {
    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-1'),
      answerId: new UniqueEntityId('answer-1'),
    })

    expect(isLeft()).toBe(true)
    expect(value).toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be able to choose a best question answer if authorId does not match the question author', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })
    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await inMemoryQuestionRepository.create(newQuestion)
    await inMemoryAnswerRepository.create(newAnswer)

    const { isLeft, value } = await sut.execute({
      authorId: new UniqueEntityId('author-2'),
      answerId: newAnswer.id,
    })

    expect(isLeft()).toBe(true)
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
