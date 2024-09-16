import { Module } from '@nestjs/common';
import { ProductosTiendasService } from './productos-tiendas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/productos/entities/producto-entity';
import { TiendaEntity } from 'src/tiendas/entities/tienda-entity';
import { ProductoTiendaEntity } from './entities/producto-tienda-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoEntity,
      TiendaEntity,
      ProductoTiendaEntity,
    ]),
  ],
  providers: [ProductosTiendasService],
})
export class ProductosTiendasModule {}
