import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  providers: [ProductosService],
})
export class ProductosModule {}
