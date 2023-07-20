import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }
}
