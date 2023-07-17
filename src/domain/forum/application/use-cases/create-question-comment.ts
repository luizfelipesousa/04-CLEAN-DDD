import { Either, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { QuestionComments } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface CreateQuestionCommentUseCaseRequest {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
}

type CreateQuestionCommentUseCaseResponse = Either<null, QuestionComments>

export class CreateQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CreateQuestionCommentUseCaseRequest): Promise<CreateQuestionCommentUseCaseResponse> {
    const questionComment = QuestionComments.create({
      authorId,
      questionId,
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right(questionComment)
  }
}
