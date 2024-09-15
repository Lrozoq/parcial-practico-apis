import { ProductoTiendaEntity } from '../../productos-tiendas/entities/producto-tienda-entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre: string;

  @Column()
  precio: number;

  @Column()
  tipo: string;

  @OneToMany(
    () => ProductoTiendaEntity,
    (productoTienda) => productoTienda.producto,
  )
  productoTiendas: ProductoTiendaEntity[];
}
