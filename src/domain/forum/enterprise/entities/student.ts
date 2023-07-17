import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entitiy-id'

interface StudentsProps {
  name: string
}

export class Student extends Entity<StudentsProps> {
  get name() {
    return this.props.name
  }

  static create(props: StudentsProps, id?: UniqueEntityId) {
    const student = new Student(props, id)
    return student
  }
}
