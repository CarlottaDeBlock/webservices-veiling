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
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import type { Session } from '../types/auth';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Companies')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all companies visible for the current user',
    type: CompanyListResponseDto,
  })
  @Get()
  async getAll(@CurrentUser() user: Session): Promise<CompanyListResponseDto> {
    return this.companyService.getAll(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get company by ID',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<CompanyResponseDto> {
    return this.companyService.getById(id, user);
  }

  @ApiResponse({
    status: 201,
    description: 'Create company',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.create(createCompanyDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update company',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
    @Body() updateCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.updateById(id, updateCompanyDto, user);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete company',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    await this.companyService.deleteById(id, user);
  }
}
