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
import { LotResponseDto } from '../lot/lot.dto';
import { LotService } from '../lot/lot.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly lotService: LotService,
  ) {}

  @Get()
  async getAll(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @Get(':id/favoriteLots')
  async getFavoriteLots(@Param('id') id: string): Promise<LotResponseDto[]> {
    return this.lotService.getFavoriteLotsByUserId(Number(id));
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

  @Post(':id/favoritelots/:lotId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFavoriteLot(
    @Param('id') id: string,
    @Param('lotId') lotId: string,
  ): Promise<void> {
    await this.lotService.addFavoriteLot(Number(id), Number(lotId));
  }
  @Delete(':id/favoritelots/:lotId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavoriteLot(
    @Param('id') id: string,
    @Param('lotId') lotId: string,
  ): Promise<void> {
    await this.lotService.removeFavoriteLot(Number(id), Number(lotId));
  }
}
