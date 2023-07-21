import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface EditQuestionUseCaseRequest {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  Question
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    title,
    content,
    questionId,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (question.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    const currentQuestionsAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionsAttachments,
    )

    const attachmentList = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId,
      })
    })

    questionAttachmentList.update(attachmentList)

    question.content = content
    question.title = title
    question.attachments = questionAttachmentList

    await this.questionRepository.save(question)

    return right(question)
  }
}
