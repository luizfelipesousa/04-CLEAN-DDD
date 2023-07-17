import { Either, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { AnswerComments } from '../../enterprise/entities/answer-comments'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface CreateAnswerCommentUseCaseRequest {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
}

type CreateAnswerCommentUseCaseResponse = Either<null, AnswerComments>

export class CreateAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CreateAnswerCommentUseCaseRequest): Promise<CreateAnswerCommentUseCaseResponse> {
    const answerComment = AnswerComments.create({
      authorId,
      answerId,
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return right(answerComment)
  }
}
