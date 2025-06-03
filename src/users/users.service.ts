import { Injectable } from '@nestjs/common'
import { User } from './users.entity'
import { UserRepository } from './user.repository'
import { CreateUserInput } from './user.inputs'
import { UserAlreadyExistsException } from './exception/user-already-exists.exception'
import { UserNotFoundException } from './exception/user-not-found.exception'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(input: CreateUserInput): Promise<void> {
    const existing = await this.userRepository.findByEmail(input.email)
    if (existing) {
      throw new UserAlreadyExistsException(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)
    const user = User.create({ ...input, password: hashedPassword })

    await this.userRepository.create(user)
    return 
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new UserNotFoundException(id)
    }
    return user
  }

  async updateUser(id: string, input: User): Promise<User> {
    const user = await this.findById(id)
    return this.userRepository.update(user.id, input)
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id)
    await this.userRepository.deleteById(user.id)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UserNotFoundException(email)
    }
    return user
  }
}
