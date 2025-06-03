import { HttpStatus } from '@nestjs/common'
import { ProblemDetailsException } from 'src/common/exception/problems-details.exception'

export class UserNotFoundException extends ProblemDetailsException {
  constructor(userId: string) {
    super({
      title: 'User Not Found',
      status: HttpStatus.NOT_FOUND,
      detail: `User with ID "${userId}" was not found.`,
      instance: `/users/${userId}`,
    })
  }
}

