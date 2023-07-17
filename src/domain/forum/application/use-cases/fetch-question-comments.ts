import { Either, right } from '@/core/either'
import { QuestionComments } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, QuestionComments[]>

export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRespository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRespository.findManyByQuestionId(questionId, {
        page,
      })

    return right(questionComments)
  }
}
