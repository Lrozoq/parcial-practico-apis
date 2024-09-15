import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './productos/entities/producto-entity';
import { TiendaEntity } from './tiendas/entities/tienda-entity';
import { ProductoTiendaEntity } from './productos-tiendas/entities/producto-tienda-entity';

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
      entities: [ProductoEntity, TiendaEntity, ProductoTiendaEntity],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
