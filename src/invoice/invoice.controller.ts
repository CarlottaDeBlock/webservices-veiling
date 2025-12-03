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
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  InvoiceListResponseDto,
  InvoiceResponseDto,
} from './invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getAll(): Promise<InvoiceListResponseDto> {
    return this.invoiceService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<InvoiceResponseDto> {
    return this.invoiceService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.updateById(id, updateInvoiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.invoiceService.deleteById(id);
  }
}
