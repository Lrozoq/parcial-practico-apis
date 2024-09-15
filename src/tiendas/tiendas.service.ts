import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from './entities/tienda-entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicExcpetion } from '../shared/errors/business-error';

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
}
