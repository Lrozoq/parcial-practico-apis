import { ProductoTiendaEntity } from '../../productos-tiendas/entities/producto-tienda-entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @OneToMany(
    () => ProductoTiendaEntity,
    (productoTienda) => productoTienda.tienda,
  )
  productoTiendas: ProductoTiendaEntity[];
}
