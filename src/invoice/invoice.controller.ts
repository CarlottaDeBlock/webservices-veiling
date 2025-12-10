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
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  InvoiceListResponseDto,
  InvoiceResponseDto,
} from './invoice.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import type { Session } from '../types/auth';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Invoices')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all invoices visible for the current user',
    type: InvoiceListResponseDto,
  })
  @Get()
  async getAll(@CurrentUser() user: Session): Promise<InvoiceListResponseDto> {
    return this.invoiceService.getAll(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get invoice by ID',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.getById(id, user);
  }

  @ApiResponse({
    status: 201,
    description: 'Create invoice',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update invoice',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  @Put(':id')
  @Roles(Role.ADMIN, Role.PROVIDER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.updateById(id, updateInvoiceDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete invoice',
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.invoiceService.deleteById(id);
  }
}
