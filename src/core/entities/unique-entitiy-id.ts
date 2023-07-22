import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(uuid: UniqueEntityId) {
    if (uuid === this) {
      return true
    }

    if (uuid.toValue() === this.value) {
      return true
    }

    return false
  }
}
