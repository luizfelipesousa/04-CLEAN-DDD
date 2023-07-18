import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { faker } from '@faker-js/faker'
import {
  QuestionComments,
  QuestionCommentsProps,
} from '@/domain/forum/enterprise/entities/question-comments'

export function makeQuestionComments(
  override: Partial<QuestionCommentsProps> = {},
  id?: UniqueEntityId,
): QuestionComments {
  const questionComment = QuestionComments.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return questionComment
}
