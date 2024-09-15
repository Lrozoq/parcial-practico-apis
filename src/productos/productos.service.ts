import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductoEntity } from './entities/producto-entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicExcpetion,
} from '../shared/errors/business-error';

const tiposProductos = ['Perecedoro', 'No perecedero'];

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (!tiposProductos.includes(producto.tipo)) {
      throw new BusinessLogicExcpetion(
        'El tipo de producto no es valido',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    if (!tiposProductos.includes(producto.tipo)) {
      throw new BusinessLogicExcpetion(
        'El tipo de producto no es valido',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({ where: { id } });
    if (!persistedProducto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.productoRepository.save({
      ...persistedProducto,
      ...producto,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    await this.productoRepository.remove(producto);
  }
}
