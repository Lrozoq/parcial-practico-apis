import { ProductoTienda } from "src/productos-tiendas/entities/producto-tienda";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nombre: string;

  @Column()
  precio: number;

  @Column()
  tipo: string;

  @OneToMany(() => ProductoTienda, productoTienda => productoTienda.producto)
  productoTiendas: ProductoTienda[];
}
