import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  CompanyListResponseDto,
  CompanyResponseDto,
  CreateCompanyDto,
} from './company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAll(): Promise<CompanyListResponseDto> {
    return this.companyService.getAll();
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompanyResponseDto> {
    return this.companyService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.create(createCompanyDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.updateById(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.companyService.deleteById(id);
  }
}
