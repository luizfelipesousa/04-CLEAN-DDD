import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { Question } from '../../enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionRepository {
  findById(questionId: UniqueEntityId): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecentQuestions(params: PaginationParams): Promise<Question[]>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<void>
}
