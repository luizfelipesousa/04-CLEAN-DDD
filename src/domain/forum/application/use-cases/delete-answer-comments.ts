import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'

interface DeleteAnswerCommentsUseCaseRequest {
  authorId: UniqueEntityId
  answerCommentsId: UniqueEntityId
}

type DeleteAnswerCommentsUseCaseResponse = Either<
  NotAllowedError | ResouceNotFoundError,
  {}
>

export class DeleteAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentsId,
  }: DeleteAnswerCommentsUseCaseRequest): Promise<DeleteAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findById(
      answerCommentsId,
    )

    if (!answerComments) {
      return left(new ResouceNotFoundError())
    }

    if (answerComments.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComments)

    return right({})
  }
}
