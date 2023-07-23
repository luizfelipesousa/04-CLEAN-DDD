import { describe, it } from 'vitest'
import { InMemoryAnswerRepository } from 'test/in-memory-repository/in-memory-answer-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/in-memory-repository/in-memory-answer-attachment-repository'
import { OnAnswerCreated } from './on-answer-created'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

describe('On Answer Created', () => {
  it('should send a notification when an answer is created', async () => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    const onAnswerCreated = new OnAnswerCreated() // eslint-disable-line
    const answer = makeAnswer()
    inMemoryAnswerRepository.create(answer)
  })
})
