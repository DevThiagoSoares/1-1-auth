import { HttpStatus } from '@nestjs/common'
import { ProblemDetailsException } from 'src/common/exception/problems-details.exception'

export class UserAlreadyExistsException extends ProblemDetailsException {
  constructor(email: string) {
    super({
      title: 'User Already Exists',
      status: HttpStatus.CONFLICT,
      detail: `A user with email "${email}" already exists.`,
      instance: '/users',
    })
  }
}