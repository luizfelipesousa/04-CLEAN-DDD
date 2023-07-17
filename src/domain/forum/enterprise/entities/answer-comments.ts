import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { Optional } from '@/core/types/optional'
import { CommentProps, Comments } from './comment'

export interface AnswerCommentsProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComments extends Comments<AnswerCommentsProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentsProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answerComments = new AnswerComments(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return answerComments
  }
}
