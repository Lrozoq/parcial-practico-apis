import { Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './entities/tienda-entity';
import { TiendasController } from './tiendas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendasService],
  controllers: [TiendasController]
})
export class TiendasModule {}
