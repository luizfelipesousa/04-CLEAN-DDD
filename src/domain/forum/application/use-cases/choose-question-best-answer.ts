import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { AnswerRepository } from '../repositories/answer-repository'
import { Either, left, right } from '@/core/either'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: UniqueEntityId
  authorId: UniqueEntityId
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  Question
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRespository: QuestionRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId.toString())

    if (!answer) {
      return left(new ResouceNotFoundError())
    }
    const question = await this.questionRespository.findById(answer.questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (question.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answerId

    await this.questionRespository.save(question)

    return right(question)
  }
}
