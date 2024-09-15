import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { ProductosTiendasModule } from './productos-tiendas/productos-tiendas.module';

@Module({
  imports: [ProductosModule, TiendasModule, ProductosTiendasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
