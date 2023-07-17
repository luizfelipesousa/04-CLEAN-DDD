import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comments'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  items: QuestionComments[] = []

  async create(questionComments: QuestionComments) {
    this.items.push(questionComments)
  }

  async findById(questionId: UniqueEntityId) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId.toString(),
    )

    if (!question) {
      return null
    }

    return question
  }

  async findManyByQuestionId(
    questionIdText: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items.filter(
      (qc) => qc.questionId.toString() === questionIdText,
    )

    return questionComments.slice((page - 1) * 20, page * 20)
  }

  async delete(questionComments: QuestionComments) {
    const questionCommentsIndex = this.items.findIndex(
      (qc) => qc.id === questionComments.id,
    )
    this.items.splice(questionCommentsIndex, 1)
  }

  async save(questionComments: QuestionComments) {
    const questionCommentsIndex = this.items.findIndex(
      (qc) => qc.id === questionComments.id,
    )
    this.items[questionCommentsIndex] = questionComments
  }
}
