import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswerRepository implements AnswerRepository {
  items: Answer[] = []

  constructor(
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(answerId: string) {
    const answer = this.items.find((a) => a.id.toString() === answerId)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return answers.slice((page - 1) * 20, page * 20)
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer) {
    const answerIndex = this.items.findIndex(
      (a) => a.id.toString() === answer.id.toString(),
    )
    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id)
    this.items.splice(answerIndex, 1)
  }

  async save(answer: Answer) {
    const answerIndex = this.items.findIndex((q) => q.id === answer.id)
    this.items[answerIndex] = answer
  }
}
