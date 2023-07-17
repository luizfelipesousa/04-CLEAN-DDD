import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { AnswerComments } from '../../enterprise/entities/answer-comments'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

interface EditAnswerCommentsUseCaseRequest {
  authorId: UniqueEntityId
  answerCommentsId: UniqueEntityId
  content: string
}

type EditAnswerCommentsUseCaseResponse = Either<
  NotAllowedError | ResouceNotFoundError,
  AnswerComments
>

export class EditAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    content,
    answerCommentsId,
  }: EditAnswerCommentsUseCaseRequest): Promise<EditAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findById(
      answerCommentsId,
    )

    if (!answerComments) {
      return left(new ResouceNotFoundError())
    }

    if (answerComments.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    answerComments.content = content

    await this.answerCommentsRepository.save(answerComments)

    return right(answerComments)
  }
}
