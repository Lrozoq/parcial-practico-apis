import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductoTiendaEntity } from "../../productos-tiendas/entities/producto-tienda-entity";
import { ProductoEntity } from "../../productos/entities/producto-entity";
import { TiendaEntity } from "../../tiendas/entities/tienda-entity";

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory',
    dropSchema: true,
    entities: [ProductoEntity, TiendaEntity, ProductoTiendaEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    ProductoEntity,
    TiendaEntity,
    ProductoTiendaEntity
  ])
]