import { Test, TestingModule } from '@nestjs/testing';
import { TiendasService } from './tiendas.service';
import { Repository } from 'typeorm';
import { TiendaEntity } from './entities/tienda-entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TiendasService', () => {
  let service: TiendasService;

  let repository: Repository<TiendaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendasService],
    }).compile();

    service = module.get<TiendasService>(TiendasService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
