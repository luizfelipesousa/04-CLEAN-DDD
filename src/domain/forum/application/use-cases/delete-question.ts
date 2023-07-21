import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { QuestionRepository } from '../repositories/question-repository'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'
import { Either, left, right } from '@/core/either'

interface DeleteQuestionUseCaseRequest {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
}

type DeleteQuestionUseCaseResponse = Either<
  NotAllowedError | ResouceNotFoundError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (question.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question)

    return right({})
  }
}
