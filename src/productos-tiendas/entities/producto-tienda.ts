import { Producto } from "src/productos/entities/producto";
import { Tienda } from "src/tiendas/entities/tienda";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ProductoTienda {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Producto, producto => producto.productoTiendas, { onDelete: 'CASCADE' })
  producto: Producto;

  @ManyToOne(() => Tienda, tienda => tienda.productoTiendas, { onDelete: 'CASCADE' })
  tienda: Tienda;
}