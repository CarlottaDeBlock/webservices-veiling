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
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
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
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly lotService: LotService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get all users (admin only)',
    type: PublicUserListResponseDto,
  })
  @Roles(Role.ADMIN)
  @Get()
  async getAll(): Promise<PublicUserListResponseDto> {
    return this.userService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Get favorite lots for a user',
    type: LotResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(CheckUserAccessGuard)
  @Get(':id/favoriteLots')
  async getFavoriteLots(
    @Param('id', ParseUserIdPipe) id: number | 'me',
    @CurrentUser() user: Session,
  ): Promise<LotResponseDto[]> {
    return this.lotService.getFavoriteLotsByUserId(id === 'me' ? user.id : id);
  }

  @ApiResponse({
    status: 200,
    description: 'Get user by ID (or "me")',
    type: PublicUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(CheckUserAccessGuard)
  @Get(':id')
  async getById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<PublicUserResponseDto> {
    const userId = id === 'me' ? user.id : id;
    return this.userService.getById(userId);
  }

  @ApiResponse({
    status: 201,
    description: 'Register a new user and return a JWT token',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  @Post()
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  @ApiResponse({
    status: 200,
    description: 'Update user (or "me")',
    type: PublicUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(CheckUserAccessGuard)
  @Put(':id')
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

  @ApiResponse({
    status: 204,
    description: 'Delete user (or "me")',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(CheckUserAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return await this.userService.deleteById(id === 'me' ? user.id : id);
  }

  @ApiResponse({
    status: 204,
    description: 'Add a lot to user favorites',
  })
  @ApiResponse({
    status: 404,
    description: 'User or lot not found',
  })
  @UseGuards(CheckUserAccessGuard)
  @Post(':id/favoritelots/:lotId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFavoriteLot(
    @Param('id', ParseUserIdPipe) id: number | 'me',
    @CurrentUser() user: Session,
    @Param('lotId', ParseIntPipe) lotId: number,
  ): Promise<void> {
    const userId = id === 'me' ? user.id : id;
    await this.lotService.addFavoriteLot(userId, lotId);
  }

  @ApiResponse({
    status: 204,
    description: 'Remove a lot from user favorites',
  })
  @ApiResponse({
    status: 404,
    description: 'User or lot not found',
  })
  @UseGuards(CheckUserAccessGuard)
  @Delete(':id/favoritelots/:lotId')
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
