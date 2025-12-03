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
import { LotService } from './lot.service';
import { CreateLotDto, LotListResponseDto, LotResponseDto } from './lot.dto';

@Controller('lots')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Get()
  async getAll(): Promise<LotListResponseDto> {
    return this.lotService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<LotResponseDto> {
    return this.lotService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLotDto: CreateLotDto): Promise<LotResponseDto> {
    return this.lotService.create(createLotDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLotDto: CreateLotDto,
  ): Promise<LotResponseDto> {
    return this.lotService.updateById(id, updateLotDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.lotService.deleteById(id);
  }
}
