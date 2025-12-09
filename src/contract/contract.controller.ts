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
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  ContractListResponseDto,
  ContractResponseDto,
} from './contract.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async getAll(@CurrentUser() user: Session): Promise<ContractListResponseDto> {
    return this.contractService.getAll(user);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<ContractResponseDto> {
    return this.contractService.getById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    return this.contractService.create(createContractDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.PROVIDER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    return this.contractService.updateById(id, updateContractDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.contractService.deleteById(id);
  }
}
