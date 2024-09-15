import { ProductoTienda } from "src/productos-tiendas/entities/producto-tienda";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tienda {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @OneToMany(() => ProductoTienda, productoTienda => productoTienda.tienda)
  productoTiendas: ProductoTienda[];
}