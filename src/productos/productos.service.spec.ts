import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from './entities/producto-entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductosService],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        precio: Number.parseInt(faker.commerce.price()),
        tipo: obtenerTipoProducto(),
        productoTiendas: null
      })
      productosList.push(producto);
    }
  }

  function obtenerTipoProducto(): string {
    const tiposProductos = ['Perecedoro', 'No perecedero'];
    const indiceAleatorio = Math.floor(Math.random() * tiposProductos.length);
    return tiposProductos[indiceAleatorio];
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const product: ProductoEntity[] = await service.findAll();
    expect(product).not.toBeNull();
    expect(product).toHaveLength(productosList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(producto.nombre)
    expect(producto.precio).toEqual(producto.precio)
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el producto con la identificación proporcionada.")
  });


  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: obtenerTipoProducto(),
      productoTiendas: []
    }

    const newProduct: ProductoEntity = await service.create(producto);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductoEntity = await repository.findOne({where: {id: newProduct.id}})
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(newProduct.nombre)
    expect(storedProduct.precio).toEqual(newProduct.precio)
  });

  it('create should throw an exception for an invalid tipo de producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.company.name(),
      precio: Number.parseInt(faker.commerce.price()),
      tipo: "otro tipo de producto",
      productoTiendas: []
    }

    await expect(() => service.create(producto)).rejects.toHaveProperty("message", "El tipo de producto no es valido")
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "New name";
    producto.precio = Number.parseInt(faker.commerce.price());
    producto.tipo =  obtenerTipoProducto();

  
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
  
    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre)
    expect(storedProducto.precio).toEqual(producto.precio)
    expect(storedProducto.tipo).toEqual(producto.tipo)
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New name", precio: 10000, tipo: obtenerTipoProducto()
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "No se encontró el producto con la identificación proporcionada.")
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New name", precio: 10000, tipo: "tipo actualizado"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El tipo de producto no es valido")
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
  
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró el producto con la identificación proporcionada.")
  });
});
