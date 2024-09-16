import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto-entity';
import { ProductosController } from './productos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  providers: [ProductosService],
  controllers: [ProductosController],
})
export class ProductosModule {}
