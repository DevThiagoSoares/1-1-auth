import { HttpException, HttpStatus } from '@nestjs/common'

export class ForbiddenRoleException extends HttpException {
  constructor(requiredRoles: string[], currentRole?: string) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Access denied: insufficient permissions',
        detail: `Required role(s): ${requiredRoles.join(', ')}. Current role: ${currentRole || 'none'}.`,
        type: 'https://httpstatuses.com/403',
      },
      HttpStatus.FORBIDDEN
    )
  }
}
