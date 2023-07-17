import { UniqueEntityId } from './unique-entitiy-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id() {
    return this._id
  }
}
