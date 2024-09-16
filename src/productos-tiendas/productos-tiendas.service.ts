import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../productos/entities/producto-entity';
import {
  BusinessError,
  BusinessLogicExcpetion,
} from '../shared/errors/business-error';
import { TiendaEntity } from '../tiendas/entities/tienda-entity';
import { Repository } from 'typeorm';
import { ProductoTiendaEntity } from './entities/producto-tienda-entity';

@Injectable()
export class ProductosTiendasService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
    @InjectRepository(ProductoTiendaEntity)
    private readonly productoTiendaRepository: Repository<ProductoTiendaEntity>,
  ) {}

  async addStoreToProduct(
    tiendaId: string,
    productoId: string,
  ): Promise<ProductoTiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }

    const productoTienda = new ProductoTiendaEntity();
    productoTienda.producto = producto;
    productoTienda.tienda = tienda;

    return this.productoTiendaRepository.save(productoTienda);
  }

  async findStoresFromProduct(productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['productoTiendas'],
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const stores = producto.productoTiendas.map(
      (productoTienda) => productoTienda.tienda,
    );
    return stores;
  }

  async findStoreFromProduct(tiendaId: string, productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['productoTiendas'],
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
      relations: ['productoTiendas'],
    });
    if (!tienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const productoTienda = await this.productoTiendaRepository.findOne({
      where: {
        producto: producto,
        tienda: tienda,
      },
    });
    if (!productoTienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda asociada al producto',
        BusinessError.NOT_FOUND,
      );
    }
    return productoTienda.tienda;
  }

  async updateStoresFromProduct(productoId: string, tiendasIds: string[]) {
    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['productoTiendas'],
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const tiendas: TiendaEntity[] = [];
    for (const tiendaId of tiendasIds) {
      const tienda = await this.tiendaRepository.findOne({
        where: { id: tiendaId },
      });
      if (!tienda) {
        throw new BusinessLogicExcpetion(
          `No se encontró la tienda con la identificación ${tiendaId}`,
          BusinessError.NOT_FOUND,
        );
      }
      tiendas.push(tienda);
    }
    producto.productoTiendas = [];
    for (const tienda of tiendas) {
      const productoTienda = this.productoTiendaRepository.create({
        producto: producto,
        tienda: tienda,
      });
      producto.productoTiendas.push(productoTienda);
    }

    await this.productoRepository.save(producto);

    return producto;
  }

  async deleteStoreFromProduct(productoId: string, tiendaId: string) {
    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['productoTiendas'],
    });
    if (!producto) {
      throw new BusinessLogicExcpetion(
        'No se encontró el producto con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
      relations: ['productoTiendas'],
    });
    if (!tienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    const productoTienda = await this.productoTiendaRepository.findOne({
      where: {
        producto: producto,
        tienda: tienda,
      },
    });
    if (!productoTienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda asociada al producto',
        BusinessError.NOT_FOUND,
      );
    }
    await this.productoTiendaRepository.remove(productoTienda);
  }
}
