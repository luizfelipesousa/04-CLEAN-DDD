import { UniqueEntityId } from '../entities/unique-entitiy-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
