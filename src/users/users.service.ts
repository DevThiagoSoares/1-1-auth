import { Injectable, Logger } from '@nestjs/common'
import { User } from './users.entity'
import { UserRole } from '../common/enums/user-role.enum'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  private users: User[] = [
    { id: 1, username: 'admin', password: '123', role: UserRole.ADMIN },
    { id: 2, username: 'user', password: '123', role: UserRole.USER },
  ]

  findByUsername(username: string) {
    return this.users.find(u => u.username === username)
  }

  findAll() {
    this.logger.debug('Fetching all users')
    return this.users
  }
}
