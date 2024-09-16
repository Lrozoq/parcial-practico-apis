import { Module } from '@nestjs/common';
import { ProductosTiendasService } from './productos-tiendas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/productos/entities/producto-entity';
import { TiendaEntity } from 'src/tiendas/entities/tienda-entity';
import { ProductoTiendaEntity } from './entities/producto-tienda-entity';
import { ProductosTiendasController } from './productos-tiendas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoEntity,
      TiendaEntity,
      ProductoTiendaEntity,
    ]),
  ],
  providers: [ProductosTiendasService],
  controllers: [ProductosTiendasController],
})
export class ProductosTiendasModule {}
