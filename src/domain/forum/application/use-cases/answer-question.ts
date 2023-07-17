import { Either, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
  content: string
  questionId: UniqueEntityId
  instructorId: UniqueEntityId
}

type AnswerQuestionUseCaseResponse = Either<null, Answer>
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      questionId,
      authorId: instructorId,
    })

    this.answerRepository.create(answer)

    return right(answer)
  }
}
