import { UseCaseError } from '@/core/error/use-case-error'

export class ResouceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
