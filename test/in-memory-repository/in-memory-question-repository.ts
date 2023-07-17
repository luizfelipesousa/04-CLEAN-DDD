import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  items: Question[] = []

  async findById(questionId: UniqueEntityId) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId.toString(),
    )

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecentQuestions({ page }: PaginationParams) {
    const sortedRecentItems = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return sortedRecentItems.slice((page - 1) * 20, page * 20)
  }

  async create(question: Question) {
    this.items.push(question)
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex((q) => q.id === question.id)
    this.items.splice(questionIndex, 1)
  }

  async save(question: Question) {
    const questionIndex = this.items.findIndex((q) => q.id === question.id)
    this.items[questionIndex] = question
  }
}
