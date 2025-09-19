import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Get('roles')
  getUserRoles() {
    return this.usersService.getUserRoles();
  }

  @Patch(':id/roles')
  updateUserRoles(@Param('id') id: string, @Body() body: UpdateRolesDto) {
    return this.usersService.updateRoles(id, body.roles ?? []);
  }

  // Wrote about this in Readme.md in 3)
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}


