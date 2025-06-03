import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../../src/users/users.service'
import { UserRole } from '../../src/common/enums/user-role.enum'
import { CreateUserInput } from '../../src/users/user.inputs'
import { UserRepository } from '../../src/users/user.repository'
import { UserAlreadyExistsException } from '../../src/users/exception/user-already-exists.exception'
import { UserNotFoundException } from '../../src/users/exception/user-not-found.exception'
import { User } from '../../src/users/users.entity'

describe('UsersService', () => {
  let service: UsersService
  let repository: jest.Mocked<UserRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get(UserRepository)
  })

  const input: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
    role: UserRole.USER,
    firstName: 'Test',
    lastName: 'User',
    phone: '551234567890',
  }

  it('should hash the password and call repository.create', async () => {
    repository.findByEmail.mockResolvedValue(null)
    repository.create.mockResolvedValue(undefined)

    await service.createUser(input)

    expect(repository.findByEmail).toHaveBeenCalledWith(input.email)
    expect(repository.create).toHaveBeenCalled()

    const userCreated = repository.create.mock.calls[0][0] 

    expect(userCreated.email.getValue()).toBe(input.email)
    expect(userCreated.firstName).toBe(input.firstName)

    const isHashed = await bcrypt.compare(input.password, userCreated.password)
    expect(isHashed).toBe(true)
  })

  it('should throw if user already exists', async () => {
    repository.findByEmail.mockResolvedValue({ id: 'some-id' } as any)

    await expect(service.createUser(input)).rejects.toThrow(UserAlreadyExistsException)
  })

  it('should return user by id', async () => {
    const mockUser = { id: '1' } as User
    repository.findById.mockResolvedValue(mockUser)

    const result = await service.findById('1')
    expect(result).toBe(mockUser)
    expect(repository.findById).toHaveBeenCalledWith('1')
  })

  it('should throw if user already exists', async () => {
    repository.findByEmail.mockResolvedValue({ id: 'some-id' } as any)

    await expect(service.createUser(input)).rejects.toThrow(UserAlreadyExistsException)
  })

  it('should return user by id', async () => {
    const mockUser = { id: '1' } as User
    repository.findById.mockResolvedValue(mockUser)

    const result = await service.findById('1')
    expect(result).toBe(mockUser)
    expect(repository.findById).toHaveBeenCalledWith('1')
  })

  it('should throw if user not found by id', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(service.findById('999')).rejects.toThrow(UserNotFoundException)
  })

  it('should update a user', async () => {
    const mockUser = { id: '1' } as User
    const updated = { ...mockUser, firstName: 'Updated' } as User

    repository.findById.mockResolvedValue(mockUser)
    repository.update.mockResolvedValue(updated)

    const result = await service.updateUser('1', updated)

    expect(repository.update).toHaveBeenCalledWith('1', updated)
    expect(result).toBe(updated)
  })

  it('should delete a user by id', async () => {
    const mockUser = { id: '1' } as User
    repository.findById.mockResolvedValue(mockUser)
    repository.deleteById.mockResolvedValue(undefined)

    await service.deleteUser('1')

    expect(repository.deleteById).toHaveBeenCalledWith('1')
  })

  it('should return all users', async () => {
    const users = [{ id: '1' }, { id: '2' }] as User[]
    repository.findAll.mockResolvedValue(users)

    const result = await service.findAll()

    expect(result).toBe(users)
  })

  it('should return user by email', async () => {
    const mockUser = { id: '1' } as User
    repository.findByEmail.mockResolvedValue(mockUser)

    const result = await service.findByEmail('test@example.com')

    expect(result).toBe(mockUser)
    expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com')
  })

  it('should throw if user not found by email', async () => {
    repository.findByEmail.mockResolvedValue(null)

    await expect(service.findByEmail('notfound@example.com')).rejects.toThrow(UserNotFoundException)
  })
})