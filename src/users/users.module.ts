import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, Users } from './user.schema'
import { UserRepository } from './user.repository'

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }])
],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
