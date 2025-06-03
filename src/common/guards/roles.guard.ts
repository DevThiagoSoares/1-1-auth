import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY, IS_PUBLIC_KEY } from '../decorators/roles.decorator'
import { UserRole } from '../enums/user-role.enum'
import { ForbiddenRoleException } from '../../auth/exceptions/forbidden-role.exception'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenRoleException(requiredRoles, user?.role)
    }

    return true
  }
}
