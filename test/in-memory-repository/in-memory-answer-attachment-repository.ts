import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswersId(answerId: UniqueEntityId) {
    const filteredAttachments = this.items.filter((attachment) => {
      return attachment.answerId.toValue() === answerId.toValue()
    })

    return filteredAttachments
  }

  async deleteManyByAnswerId(answerId: UniqueEntityId) {
    const remaningAttachments = this.items.filter((attachment) => {
      return attachment.answerId.toValue() !== answerId.toValue()
    })
    this.items = remaningAttachments
  }
}
