import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TiendaEntity } from './entities/tienda-entity';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from './dto/tienda.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  @Get()
  async findAll() {
    return await this.tiendasService.findAll();
  }

  @Get(':storeId')
  async findOne(@Param('storeId') storeId: string) {
    return await this.tiendasService.findOne(storeId);
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendasService.create(tienda);
  }

  @Put(':tiendaId')
  async update(
    @Param('tiendaId') tiendaId: string,
    @Body() tiendaDto: TiendaDto,
  ) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendasService.update(tiendaId, tienda);
  }

  @Delete(':tiendaId')
  @HttpCode(204)
  async delete(@Param('tiendaId') tiendaId: string) {
    return await this.tiendasService.delete(tiendaId);
  }
}
