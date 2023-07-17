import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'

interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get link() {
    return this.props.link
  }

  get title() {
    return this.props.title
  }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
