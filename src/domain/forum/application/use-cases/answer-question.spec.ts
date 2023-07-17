import { beforeEach, describe, expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'

let sut: AnswerQuestionUseCase
let inMemoryAnswerRepository: InMemoryAnswerRepository

describe('Create an answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be possible to answer a question', async () => {
    const { value, isRight } = await sut.execute({
      content: 'Nova Resposta',
      instructorId: new UniqueEntityId('1'),
      questionId: new UniqueEntityId('2'),
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({ content: 'Nova Resposta' }),
      }),
    )
  })
})
