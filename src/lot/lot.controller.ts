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
  getAll(): LotListResponseDto {
    return this.lotService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): LotResponseDto {
    return this.lotService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLotDto: CreateLotDto): LotResponseDto {
    return this.lotService.create(createLotDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLotDto: CreateLotDto,
  ): LotResponseDto {
    return this.lotService.updateById(id, updateLotDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.lotService.deleteById(id);
  }
}
