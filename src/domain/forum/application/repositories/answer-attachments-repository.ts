import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  deleteManyByAnswerId(id: UniqueEntityId): Promise<void>
  findManyByAnswersId(answerId: UniqueEntityId): Promise<AnswerAttachment[]>
}
