import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../../src/auth/auth.service'
import { UsersService } from '../../src/users/users.service'
import { UserRole } from '../../src/common/enums/user-role.enum'
import { User } from 'src/users/users.entity'

describe('AuthService', () => {
  let service: AuthService
  let usersService: jest.Mocked<UsersService>
  let jwtService: jest.Mocked<JwtService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findByEmail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile()

    service = module.get(AuthService)
    usersService = module.get(UsersService)
    jwtService = module.get(JwtService)
  })

    it('should return a JWT token if credentials are valid', async () => {
    const hashedPassword = await bcrypt.hash('validPassword', 10)
    const mockUser = {
      id: 'user-id',
      email: { getValue: () => 'user@example.com', value: 'user@example.com' },
      password: hashedPassword,
      role: UserRole.USER,
      firstName: 'Test',
      lastName: 'User',
      phone: '551234567890'
    }

    usersService.findByEmail.mockResolvedValue(mockUser as any)
    jwtService.sign.mockReturnValue('jwt-token')

    const result = await service.login('user@example.com', 'validPassword')

    expect(result).toEqual({ token: 'jwt-token' })
    expect(usersService.findByEmail).toHaveBeenCalledWith('user@example.com')
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@example.com',
      role: UserRole.USER
    })
  })

  it('should throw UnauthorizedException if user is not found', async () => {
    usersService.findByEmail.mockResolvedValue(null)

    await expect(service.login('notfound@example.com', 'any')).rejects.toThrow(UnauthorizedException)
  })

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10)
    const mockUser = {
      id: 'user-id',
      email: {
        getValue: () => 'user@example.com',
        value: 'user@example.com'
      },
      password: hashedPassword,
      role: UserRole.USER,
      firstName: 'Test',
      lastName: 'User',
      phone: '551234567890'
    }

    usersService.findByEmail.mockResolvedValue(mockUser as any)

    await expect(service.login('user@example.com', 'wrongPassword')).rejects.toThrow(UnauthorizedException)
  })

})
