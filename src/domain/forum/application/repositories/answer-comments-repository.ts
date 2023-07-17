import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { AnswerComments } from '../../enterprise/entities/answer-comments'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface AnswerCommentsRepository {
  findById(answerCommentsId: UniqueEntityId): Promise<AnswerComments | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComments[]>
  create(answerComments: AnswerComments): Promise<void>
  delete(answerComments: AnswerComments): Promise<void>
  save(answerComments: AnswerComments): Promise<void>
}
