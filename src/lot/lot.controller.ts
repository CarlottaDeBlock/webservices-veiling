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

@Controller('lots')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Get()
  async getAll(): Promise<LotListResponseDto> {
    return this.lotService.getAll();
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LotDetailResponseDto> {
    return this.lotService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLotDto: CreateLotDto): Promise<LotResponseDto> {
    return this.lotService.create(createLotDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotDto: CreateLotDto,
  ): Promise<LotResponseDto> {
    return this.lotService.updateById(id, updateLotDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.lotService.deleteById(id);
  }
}
