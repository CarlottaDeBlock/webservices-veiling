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
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  RegisterUserRequestDto,
  UpdateUserRequestDto,
  PublicUserListResponseDto,
  PublicUserResponseDto,
} from './user.dto';
import { LotResponseDto } from '../lot/lot.dto';
import { LotService } from '../lot/lot.service';
import { LoginResponseDto } from '../session/session.dto';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/decorators/public.decorator';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { type Session } from '../types/auth';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { AuthDelayInterceptor } from '../auth/interceptors/authDelay.interceptor';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly lotService: LotService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  async getAll(): Promise<PublicUserListResponseDto> {
    return this.userService.getAll();
  }

  @Get(':id/favoriteLots')
  @UseGuards(CheckUserAccessGuard)
  async getFavoriteLots(
    @Param('id', ParseUserIdPipe) id: number | 'me',
    @CurrentUser() user: Session,
  ): Promise<LotResponseDto[]> {
    return this.lotService.getFavoriteLotsByUserId(id === 'me' ? user.id : id);
  }

  @Get(':id')
  @UseGuards(CheckUserAccessGuard)
  async getById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<PublicUserResponseDto> {
    const userId = id === 'me' ? user.id : id;
    return this.userService.getById(userId);
  }

  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  @Post()
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  /*@Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<PublicUserResponseDto> {
    return this.userService.create(createUserDto);
  }*/

  @Put(':id')
  @UseGuards(CheckUserAccessGuard)
  async update(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<PublicUserResponseDto> {
    return await this.userService.updateById(
      id === 'me' ? user.id : id,
      updateUserDto,
    );
  }

  @Delete(':id')
  @UseGuards(CheckUserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return await this.userService.deleteById(id === 'me' ? user.id : id);
  }

  @Post(':id/favoritelots/:lotId')
  @UseGuards(CheckUserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFavoriteLot(
    @Param('id', ParseUserIdPipe) id: number | 'me',
    @CurrentUser() user: Session,
    @Param('lotId', ParseIntPipe) lotId: number,
  ): Promise<void> {
    const userId = id === 'me' ? user.id : id;
    await this.lotService.addFavoriteLot(userId, lotId);
  }
  @Delete(':id/favoritelots/:lotId')
  @UseGuards(CheckUserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavoriteLot(
    @Param('id', ParseUserIdPipe) id: number | 'me',
    @CurrentUser() user: Session,
    @Param('lotId', ParseIntPipe) lotId: number,
  ): Promise<void> {
    const userId = id === 'me' ? user.id : id;
    await this.lotService.removeFavoriteLot(userId, lotId);
  }
}
