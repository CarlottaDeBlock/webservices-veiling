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
  getAll(): CompanyListResponseDto {
    return this.companyService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): CompanyResponseDto {
    return this.companyService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCompanyDto: CreateCompanyDto): CompanyResponseDto {
    return this.companyService.create(createCompanyDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: CreateCompanyDto,
  ): CompanyResponseDto {
    return this.companyService.updateById(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.companyService.deleteById(id);
  }
}
