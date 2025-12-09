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
} from '@nestjs/common';
import { LotService } from './lot.service';
import {
  CreateLotDto,
  LotDetailResponseDto,
  LotListResponseDto,
  LotResponseDto,
} from './lot.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/decorators/public.decorator';

@Controller('lots')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Public()
  @Get()
  async getAll(): Promise<LotListResponseDto> {
    return this.lotService.getAll();
  }

  @Public()
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LotDetailResponseDto> {
    return this.lotService.getById(id);
  }

  @Post()
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLotDto: CreateLotDto): Promise<LotResponseDto> {
    return this.lotService.create(createLotDto);
  }

  @Put(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotDto: CreateLotDto,
  ): Promise<LotResponseDto> {
    return this.lotService.updateById(id, updateLotDto);
  }

  @Delete(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.lotService.deleteById(id);
  }
}
