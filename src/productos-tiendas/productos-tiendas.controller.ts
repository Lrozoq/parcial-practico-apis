import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ProductosTiendasService } from './productos-tiendas.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductosTiendasController {
  constructor(
    private readonly productosTiendasService: ProductosTiendasService,
  ) {}

  @Post(':productoId/stores/:tiendaId')
  async addStoreToProduct(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productosTiendasService.addStoreToProduct(
      tiendaId,
      productoId,
    );
  }

  @Get(':productoId/stores')
  async findStoresFromProduct(@Param('productoId') productoId: string) {
    return await this.productosTiendasService.findStoresFromProduct(productoId);
  }

  @Get(':productoId/stores/:tiendaId')
  async findStoreFromProduct(@Param('productoId') productoId:string, @Param('tiendaId') tiendaId: string) {
    return await this.productosTiendasService.findStoreFromProduct(tiendaId, productoId);
  }

  @Put(':productoId/stores')
  async updateStoresFromProduct( @Param('productoId') productoId:string,  @Body() tiendasIds: string[] ) {
    return await this.productosTiendasService.updateStoresFromProduct(productoId, tiendasIds);
  }

  @Delete(':productoId/stores/:tiendaId')
  @HttpCode(204)
  async deleteStoresFromProduct( @Param('productoId') productoId: string , @Param('tiendaId') tiendaId: string) {
    return await this.productosTiendasService.deleteStoreFromProduct(productoId, tiendaId);
  }

}