import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(
    questionId: UniqueEntityId,
  ): Promise<QuestionAttachment[]>
}
