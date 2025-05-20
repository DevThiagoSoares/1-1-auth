import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = this.usersService.findByUsername(username)

    if (!user || user.password !== password) return null

    const payload = { username: user.username, sub: user.id, role: user.role }
    this.logger.debug(`User ${username} logged in`)
    return { access_token: this.jwtService.sign(payload) }
  }
}
