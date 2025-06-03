import { Test, TestingModule } from '@nestjs/testing'
import { UserRole } from '../../src/common/enums/user-role.enum'
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard'
import { RolesGuard } from '../../src/common/guards/roles.guard'
import { CreateUserInput } from '../../src/users/user.inputs'
import { UsersController } from '../../src/users/users.controller'
import { UsersService } from '../../src/users/users.service'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: jest.Mocked<UsersService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get(UsersService)
  })

  const input: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '551234567890',
    role: UserRole.USER,
  }

  it('should create a user', async () => {
    usersService.createUser.mockResolvedValue(undefined)

    await controller.create(input)

    expect(usersService.createUser).toHaveBeenCalledWith(input)
  })

  it('should return all users', async () => {
    const users = [{ email: 'a' }, { email: 'b' }] as any[]
    usersService.findAll.mockResolvedValue(users)

    const result = await controller.findAll()

    expect(result).toBe(users)
    expect(usersService.findAll).toHaveBeenCalled()
  })
})