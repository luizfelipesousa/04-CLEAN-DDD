import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { faker } from '@faker-js/faker'
import {
  AnswerComments,
  AnswerCommentsProps,
} from '@/domain/forum/enterprise/entities/answer-comments'

export function makeAnswerComments(
  override: Partial<AnswerCommentsProps> = {},
  id?: UniqueEntityId,
): AnswerComments {
  const answerComment = AnswerComments.create({
    content: faker.lorem.text(),
    authorId: new UniqueEntityId(),
    answerId: new UniqueEntityId(),
    ...override,
  })

  return answerComment
}
