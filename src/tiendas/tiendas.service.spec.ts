import { Test, TestingModule } from '@nestjs/testing';
import { TiendasService } from './tiendas.service';
import { Repository } from 'typeorm';
import { TiendaEntity } from './entities/tienda-entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendasService', () => {
  let service: TiendasService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendasService],
    }).compile();

    service = module.get<TiendasService>(TiendasService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.countryCode({
          variant: 'alpha-3'
        }),
        productoTiendas: null
      })
      tiendasList.push(tienda);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const tienda: TiendaEntity[] = await service.findAll();
    expect(tienda).not.toBeNull();
    expect(tienda).toHaveLength(tiendasList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.ciudad).toEqual(storedTienda.ciudad)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró la tienda con la identificación proporcionada.")
  });

  it('create should return a new store', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.countryCode({
        variant: 'alpha-3'
      }),
      productoTiendas: []
    }

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre)
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad)
    expect(storedTienda.nombre).toEqual(newTienda.nombre)
  });

  it('create should throw an exception for an invalid city store', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.countryCode({
        variant: 'alpha-2'
      }),
      productoTiendas: []
    }

    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "La ciudad debe ser valida")
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = "New name";
    tienda.direccion = faker.location.streetAddress();
    tienda.ciudad = faker.location.countryCode({
      variant: 'alpha-3'
    });

  
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
  
    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre)
    expect(storedTienda.direccion).toEqual(tienda.direccion)
    expect(storedTienda.ciudad).toEqual(tienda.ciudad)
  });

  it('update should throw an exception for an invalid store', async () => {
    let producto: TiendaEntity = tiendasList[0];
    producto = {
      ...producto, 
      nombre: "New name", 
      direccion: faker.location.streetAddress(), 
      ciudad: faker.location.countryCode({
        variant: 'alpha-3'
      })
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "No se encontró la tienda con la identificación proporcionada.")
  });

  it('update should throw an exception for an invalid city store', async () => {
    let producto: TiendaEntity = tiendasList[0];
    producto = {
      ...producto, 
      nombre: "New name", 
      direccion: faker.location.streetAddress(), 
      ciudad: faker.location.countryCode({
        variant: 'alpha-2'
      })
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "La ciudad debe ser valida")
  });

  it('delete should remove a store', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
  
    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedTienda).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró la tienda con la identificación proporcionada.")
  });
});
