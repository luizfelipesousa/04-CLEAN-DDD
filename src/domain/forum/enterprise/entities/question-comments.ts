import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { Optional } from '@/core/types/optional'
import { CommentProps, Comments } from './comment'

export interface QuestionCommentsProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComments extends Comments<QuestionCommentsProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentsProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComments = new QuestionComments(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return questionComments
  }
}
