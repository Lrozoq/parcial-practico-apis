import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './productos/entities/producto';
import { Tienda } from './tiendas/entities/tienda';
import { ProductoTienda } from './productos-tiendas/entities/producto-tienda';

@Module({
  imports: [
    ProductosModule, 
    TiendasModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial-practico',
      entities: [
        Producto,
        Tienda,
        ProductoTienda
      ],
      dropSchema: true,
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
