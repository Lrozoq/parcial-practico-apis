import { Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './entities/tienda-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendasService],
})
export class TiendasModule {}
