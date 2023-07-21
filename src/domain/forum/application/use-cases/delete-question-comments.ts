import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Either, left, right } from '@/core/either'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'
import { NotAllowedError } from '@/core/error/not-allowed-error'

interface DeleteQuestionCommentsUseCaseRequest {
  authorId: UniqueEntityId
  questionCommentsId: UniqueEntityId
}

type DeleteQuestionCommentsUseCaseResponse = Either<
  NotAllowedError | ResouceNotFoundError,
  {}
>

export class DeleteQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentsId,
  }: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findById(
      questionCommentsId,
    )

    if (!questionComments) {
      return left(new ResouceNotFoundError())
    }

    if (questionComments.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComments)

    return right({})
  }
}
