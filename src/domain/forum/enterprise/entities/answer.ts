import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachment } from './answer-attachment'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  createdAt: Date
  updateAt?: Date
  attachments: AnswerAttachment[]
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer({
      ...props,
      attachments: props.attachments ?? [],
      createdAt: new Date(),
    })

    return answer
  }
}
