import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from './entities/tienda-entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicExcpetion,
} from '../shared/errors/business-error';

@Injectable()
export class TiendasService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find();
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length != 3) {
      throw new BusinessLogicExcpetion(
        'La ciudad debe ser valida',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length != 3) {
      throw new BusinessLogicExcpetion(
        'La ciudad debe ser valida',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persistedTienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.tiendaRepository.save({
      ...persistedTienda,
      ...tienda,
    });
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda) {
      throw new BusinessLogicExcpetion(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    }
    await this.tiendaRepository.remove(tienda);
  }
}
