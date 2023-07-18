import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: UniqueEntityId) {
    const filteredAttachments = this.items.filter((attachment) => {
      return attachment.questionId.toValue() === questionId.toValue()
    })

    return filteredAttachments
  }

  async deleteManyByQuestionId(questionId: UniqueEntityId) {
    const remaningAttachments = this.items.filter((attachment) => {
      return attachment.questionId.toValue() !== questionId.toValue()
    })
    this.items = remaningAttachments
  }
}
