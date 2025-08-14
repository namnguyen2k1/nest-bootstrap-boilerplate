import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/shared/pipes/mongoid.pipe';
import { GetAllUsersDTO } from './dto/get-all-users.dto';
import { UpdateUserInfoDto } from './dto/update-user-information.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(@Query() query: GetAllUsersDTO) {
    const users = await this.userService.getAllUsers(query);
    return {
      _message: 'Find all users successfully',
      data: users,
    };
  }

  @Get(':userId')
  async getUserInfo(@Param('userId', MongoIdPipe) userId: string) {
    const result = await this.userService.getUserInfo(userId);
    return {
      _message: 'Get user information successfully',
      data: result,
    };
  }

  @Patch('permission/:userId')
  async updateUserPermission(
    @Param('userId', MongoIdPipe) userId: string,
    @Body() body: UpdateUserPermissionDto,
  ) {
    const user = await this.userService.updateUserPermission(userId, body);
    return {
      _message: 'Update user successfully',
      data: user,
    };
  }

  @Patch(':userId')
  async updateUserInfo(
    @Param('userId', MongoIdPipe) userId: string,
    @Body()
    body: UpdateUserInfoDto,
  ) {
    const result = await this.userService.updateUserInfo(userId, body);
    return {
      _message: 'Update user information successfully',
      data: result,
    };
  }

  @Delete(':userId')
  async removeUser(@Param('userId', MongoIdPipe) userId: string) {
    await this.userService.removeUser(userId);
    return {
      _message: 'Remove user successfully',
    };
  }
}
