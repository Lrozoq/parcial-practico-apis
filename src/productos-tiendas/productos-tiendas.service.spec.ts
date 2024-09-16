import { Test, TestingModule } from '@nestjs/testing';
import { ProductosTiendasService } from './productos-tiendas.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../productos/entities/producto-entity';
import { TiendaEntity } from '../tiendas/entities/tienda-entity';
import { ProductoTiendaEntity } from './entities/producto-tienda-entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('ProductosTiendasService', () => {
  let service: ProductosTiendasService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoTiendaRepository: Repository<ProductoTiendaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductosTiendasService],
    }).compile();

    service = module.get<ProductosTiendasService>(ProductosTiendasService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    productoTiendaRepository = module.get<Repository<ProductoTiendaEntity>>(
      getRepositoryToken(ProductoTiendaEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  function obtenerTipoProducto(): string {
    const tiposProductos = ['Perecedoro', 'No perecedero'];
    const indiceAleatorio = Math.floor(Math.random() * tiposProductos.length);
    return tiposProductos[indiceAleatorio];
  }

  it('addStoreToProduct should add an store to a product', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: [],
    });
    const newStore: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.countryCode({
        variant: 'alpha-3',
      }),
      productoTiendas: [],
    });

    const result: ProductoTiendaEntity = await service.addStoreToProduct(
      newStore.id,
      newProducto.id,
    );
    expect(result.producto.nombre).toEqual(newProducto.nombre);
    expect(result.tienda.nombre).toEqual(newStore.nombre);
  });

  it('findStoresFromProduct should return stores by product', async () => {
    const productosTiendas = [];
    for (let index = 0; index < 2; index++) {
      const newStore: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.countryCode({
          variant: 'alpha-3',
        }),
      });
      const productoTienda = { tienda: newStore };
      productosTiendas.push(productoTienda);
    }

    const producto = {
      id: '1',
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: productosTiendas,
    } as ProductoEntity;

    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(producto);

    const result = await service.findStoresFromProduct('1');

    expect(result.length).toEqual(2);
  });

  it('findStoreFromProduct should return store by product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.countryCode({
        variant: 'alpha-3',
      }),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: [],
    });

    const newProductoStore = await productoTiendaRepository.save({
      producto: newProducto,
      tienda: newStore,
    });

    jest
      .spyOn(productoRepository, 'findOne')
      .mockResolvedValueOnce(newProducto);
    jest.spyOn(tiendaRepository, 'findOne').mockResolvedValueOnce(newStore);
    jest
      .spyOn(productoTiendaRepository, 'findOne')
      .mockResolvedValueOnce(newProductoStore);

    const result = await service.findStoreFromProduct(
      newStore.id,
      newProducto.id,
    );
    expect(result.nombre).toEqual(newStore.nombre);
    expect(result.direccion).toEqual(newStore.direccion);
    expect(result.ciudad).toEqual(newStore.ciudad);
  });

  it('findStoreFromProduct should throw an exception if the product is not found', async () => {
    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findStoreFromProduct('1', '1')).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con la identificación proporcionada.',
    );
  });

  it('findStoreFromProduct should throw an exception if the store is not found', async () => {
    const producto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: [],
    });
    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(producto);
    jest.spyOn(tiendaRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findStoreFromProduct('1', '1')).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda con la identificación proporcionada.',
    );
  });

  it('updateStoresFromProduct should update the stores associated with a product', async () => {
    const tareasId = [];
    const producto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: [],
    });
    for (let index = 0; index < 2; index++) {
      const newStore: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.countryCode({
          variant: 'alpha-3',
        }),
      });
      tareasId.push(newStore.id);
      jest.spyOn(tiendaRepository, 'findOne').mockResolvedValueOnce(newStore);
    }

    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(producto);
    jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(producto);
    const result = await service.updateStoresFromProduct(producto.id, tareasId);
    expect(result.productoTiendas.length).toBe(2);
  });

  it('updateStoresFromProduct should throw an error if the product does not exist', async () => {
    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      service.updateStoresFromProduct('1', ['1', '2']),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con la identificación proporcionada.',
    );
  });

  it('deleteStoreFromProduct should remove the store from the product', async () => {
    const producto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: [],
    });
    const store: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.countryCode({
        variant: 'alpha-3',
      }),
    });

    const productoTienda = await productoTiendaRepository.save({
      producto: producto,
      tienda: store,
    });

    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(producto);
    jest.spyOn(tiendaRepository, 'findOne').mockResolvedValueOnce(store);
    jest
      .spyOn(productoTiendaRepository, 'findOne')
      .mockResolvedValueOnce(productoTienda);
    jest
      .spyOn(productoTiendaRepository, 'remove')
      .mockResolvedValueOnce(undefined);

    await service.deleteStoreFromProduct('1', '1');
    expect(productoTiendaRepository.remove).toHaveBeenCalledWith(
      productoTienda,
    );
  });

  it('deleteStoreFromProduct should throw an exception if the product is not associated with the store', async () => {
    const producto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: [],
    });
    const store: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.countryCode({
        variant: 'alpha-3',
      }),
    });

    jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(producto);
    jest.spyOn(tiendaRepository, 'findOne').mockResolvedValueOnce(store);
    jest.spyOn(productoTiendaRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      service.deleteStoreFromProduct(producto.id, '1'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda asociada al producto',
    );
  });
});
