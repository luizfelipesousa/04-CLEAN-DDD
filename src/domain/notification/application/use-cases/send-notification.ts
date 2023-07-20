import { Either, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'

interface SendNotificationUseCaseRequest {
  recipientId: UniqueEntityId
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<null, Notification>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId,
      title,
      content,
    })

    await this.notificationRepository.create(notification)

    return right(notification)
  }
}
