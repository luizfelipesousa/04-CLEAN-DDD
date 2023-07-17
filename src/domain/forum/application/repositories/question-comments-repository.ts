import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { QuestionComments } from '../../enterprise/entities/question-comments'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionCommentsRepository {
  findById(questionCommentsId: UniqueEntityId): Promise<QuestionComments | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComments[]>
  create(questionComments: QuestionComments): Promise<void>
  delete(questionComments: QuestionComments): Promise<void>
  save(questionComments: QuestionComments): Promise<void>
}
