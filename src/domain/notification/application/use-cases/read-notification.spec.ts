import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryNotificationRepository } from 'test/in-memory-repository/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/error/not-allowed-error'

let sut: ReadNotificationUseCase
let inMemoryNotificationRepository: InMemoryNotificationRepository

describe('Read a notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be possible to read a notification', async () => {
    const notification = makeNotification({
      content: 'new notification',
      recipientId: new UniqueEntityId('1'),
      title: 'news',
    })

    await inMemoryNotificationRepository.create(notification)

    const { value, isRight } = await sut.execute({
      recipientId: new UniqueEntityId('1'),
      notificationId: notification.id,
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          content: 'new notification',
        }),
      }),
    )
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          readAt: expect.any(Date),
        }),
      }),
    )
  })

  it('should not be able to read a notification if recipientId does not match the notification recipient', async () => {
    const newNotification = makeNotification({
      recipientId: new UniqueEntityId('recipientId-1'),
    })

    await inMemoryNotificationRepository.create(newNotification)

    const { isLeft, value } = await sut.execute({
      recipientId: new UniqueEntityId('recipientId-2'),
      notificationId: newNotification.id,
    })

    expect(isLeft()).toBe(true)
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
