import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface EditAnswerUseCaseRequest {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
  attachmentsId: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  Answer
>

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    answerId,
    attachmentsId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId.toString())

    if (!answer) {
      return left(new ResouceNotFoundError())
    }

    if (answer.authorId !== authorId) {
      return left(new NotAllowedError())
    }
    const currentAnswersAttachments =
      await this.answerAttachmentsRepository.findManyByAnswersId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswersAttachments,
    )

    const attachmentList = attachmentsId.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId,
      })
    })

    answerAttachmentList.update(attachmentList)
    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answerRepository.save(answer)

    return right(answer)
  }
}
