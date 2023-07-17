import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { QuestionComments } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface EditQuestionCommentsUseCaseRequest {
  authorId: UniqueEntityId
  questionCommentsId: UniqueEntityId
  content: string
}

type EditQuestionCommentsUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  QuestionComments
>

export class EditQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    content,
    questionCommentsId,
  }: EditQuestionCommentsUseCaseRequest): Promise<EditQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findById(
      questionCommentsId,
    )

    if (!questionComments) {
      return left(new ResouceNotFoundError())
    }

    if (questionComments.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    questionComments.content = content

    await this.questionCommentsRepository.save(questionComments)

    return right(questionComments)
  }
}
