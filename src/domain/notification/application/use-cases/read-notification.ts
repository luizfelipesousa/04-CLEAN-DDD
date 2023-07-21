import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { NotAllowedError } from '@/core/error/not-allowed-error'
import { ResouceNotFoundError } from '@/core/error/resource-not-found-error'

interface ReadNotificationUseCaseRequest {
  recipientId: UniqueEntityId
  notificationId: UniqueEntityId
}

type ReadNotificationUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  Notification
>

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(
      notificationId,
    )

    if (!notification) {
      return left(new ResouceNotFoundError())
    }

    if (notification.recipientId.toValue() !== recipientId.toValue()) {
      return left(new NotAllowedError())
    }

    notification.read()

    return right(notification)
  }
}
