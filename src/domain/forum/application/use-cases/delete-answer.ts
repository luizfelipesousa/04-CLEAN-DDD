import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { AnswerRepository } from '../repositories/answer-repository'
import { Either, left, right } from '@/core/either'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  answerId: UniqueEntityId
  authorId: UniqueEntityId
}

type DeleteAnswerUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId.toString())

    if (!answer) {
      return left(new ResouceNotFoundError())
    }

    if (answer.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right({})
  }
}
