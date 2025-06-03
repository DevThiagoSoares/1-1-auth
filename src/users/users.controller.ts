import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Public, Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/enums/user-role.enum'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { CreateUserInput } from './user.inputs'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() userDto: CreateUserInput) {
    return this.usersService.createUser(userDto)
  }
  
  @Roles(UserRole.ADMIN)
  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    console.debug('Fetching all users')
    return this.usersService.findAll()
  }
}
