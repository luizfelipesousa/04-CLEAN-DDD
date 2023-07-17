import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comments'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  items: AnswerComments[] = []

  async findById(answerId: UniqueEntityId) {
    const answer = this.items.find(
      (item) => item.id.toString() === answerId.toString(),
    )

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByAnswerId(answerIdText: string, { page }: PaginationParams) {
    const answerComments = this.items.filter(
      (qc) => qc.answerId.toString() === answerIdText,
    )

    return answerComments.slice((page - 1) * 20, page * 20)
  }

  async create(answerComments: AnswerComments) {
    this.items.push(answerComments)
  }

  async delete(answerComments: AnswerComments) {
    const answerCommentsIndex = this.items.findIndex(
      (qc) => qc.id === answerComments.id,
    )
    this.items.splice(answerCommentsIndex, 1)
  }

  async save(answerComments: AnswerComments) {
    const answerCommentsIndex = this.items.findIndex(
      (qc) => qc.id === answerComments.id,
    )
    this.items[answerCommentsIndex] = answerComments
  }
}
