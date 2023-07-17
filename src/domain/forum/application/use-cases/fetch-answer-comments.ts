import { Either, right } from '@/core/either'
import { AnswerComments } from '../../enterprise/entities/answer-comments'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, AnswerComments[]>

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRespository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRespository.findManyByAnswerId(answerId, {
        page,
      })

    return right(answerComments)
  }
}
