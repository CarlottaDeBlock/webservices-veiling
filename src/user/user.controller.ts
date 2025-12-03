import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.userService.deleteById(id);
  }
}
