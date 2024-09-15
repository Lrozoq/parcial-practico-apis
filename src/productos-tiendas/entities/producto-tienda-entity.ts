import { ProductoEntity } from '../../productos/entities/producto-entity';
import { TiendaEntity } from '../../tiendas/entities/tienda-entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductoTiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductoEntity, (producto) => producto.productoTiendas, {
    onDelete: 'CASCADE',
  })
  producto: ProductoEntity;

  @ManyToOne(() => TiendaEntity, (tienda) => tienda.productoTiendas, {
    onDelete: 'CASCADE',
  })
  tienda: TiendaEntity;
}
