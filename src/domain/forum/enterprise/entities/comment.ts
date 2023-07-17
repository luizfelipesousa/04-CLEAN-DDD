import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'

export interface CommentProps {
  content: string
  authorId: UniqueEntityId
  createdAt: Date
  updateAt?: Date
}

export abstract class Comments<
  Props extends CommentProps,
> extends Entity<Props> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
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
}
