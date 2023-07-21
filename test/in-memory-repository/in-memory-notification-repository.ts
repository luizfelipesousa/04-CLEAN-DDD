import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  items: Notification[] = []

  async findById(notificationId: UniqueEntityId) {
    const notificationIndex = this.items.find(
      (notification) => notification.id.toValue() === notificationId.toValue(),
    )

    if (!notificationIndex) {
      return null
    }

    return notificationIndex
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      (n) => n.id === notification.id,
    )
    this.items[notificationIndex] = notification
  }
}
