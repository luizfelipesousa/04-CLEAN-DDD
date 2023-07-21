import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { Notification } from '../../enterprise/entities/notification'

export interface NotificationRepository {
  findById(notificationId: UniqueEntityId): Promise<Notification | null>
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
}
