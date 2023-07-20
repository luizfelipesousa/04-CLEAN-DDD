import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique-entitiy-id'
import { InMemoryNotificationRepository } from 'test/in-memory-repository/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let sut: SendNotificationUseCase
let inMemoryNotificationRepository: InMemoryNotificationRepository

describe('Send a notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be possible to send a notification', async () => {
    const { value, isRight } = await sut.execute({
      recipientId: new UniqueEntityId('1'),
      title: 'notification title',
      content: 'is this a notification?',
    })

    expect(isRight()).toBe(true)
    expect(value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          content: 'is this a notification?',
        }),
      }),
    )
  })
})
