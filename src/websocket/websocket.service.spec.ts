import { Test, TestingModule } from '@nestjs/testing'
import { WebsocketService } from './websocket.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, Db } from 'mongodb'

describe('WebsocketService', () => {
  let service: WebsocketService
  let mongod: MongoMemoryServer
  let mongoClient: MongoClient
  let db: Db

  beforeAll(async () => {
    // Start MongoDB in memory
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    mongoClient = await MongoClient.connect(uri)
    db = mongoClient.db('testdb')
  })

  afterAll(async () => {
    await mongoClient.close()
    await mongod.stop()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: db, // Providing the in-memory database
        },
      ],
    }).compile()

    service = module.get<WebsocketService>(WebsocketService)
  })

  afterEach(async () => {
    // Clean up database between tests
    await db.collection('items').deleteMany({})
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createItem', () => {
    it('should create an item and return it', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Description of the test item',
        price: 99.99,
      }

      const result = await service.create(createItemDto, '1')
      expect(result).toHaveProperty('id')
      expect(result.name).toEqual(createItemDto.name)
      expect(result.description).toEqual(createItemDto.description)

      const itemInDb = await db.collection('items').findOne({ _id: result.id })
      expect(itemInDb).toBeDefined()
    })
  })

  describe('findAll', () => {
    it('should return an array of items', async () => {
      await db.collection('items').insertMany([
        { name: 'Item 1', description: 'Description of Item 1' },
        { name: 'Item 2', description: 'Description of Item 2' },
      ])

      const result = await service.findAll('1')
      expect(result.length).toBe(2)
    })
  })

  describe('findOne', () => {
    it('should return a single item by ID', async () => {
      const mockItem = await db.collection('items').insertOne({
        name: 'Item 1',
        description: 'Description of Item 1',
      })

      const result = await service.findOne(mockItem.insertedId, '1')
      expect(result).toHaveProperty('id', mockItem.insertedId)
    })
  })

  describe('updateItem', () => {
    it('should update an item and return it', async () => {
      const mockItem = await db.collection('items').insertOne({
        name: 'Item 1',
        description: 'Description of Item 1',
      })

      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item 1',
        description: 'Updated description of the item',
      }

      const result = await service.update(mockItem.insertedId, updateItemDto)
      expect(result.name).toBe(updateItemDto.name)
      expect(result.description).toBe(updateItemDto.description)
    })
  })

  describe('removeItem', () => {
    it('should remove an item and return a success message', async () => {
      
      const mockItem = await db.collection('items').insertOne({
        name: 'Item to delete',
        description: 'Description of the item to delete',
      })

      const result = await service.remove(mockItem.insertedId)
      expect(result).toBe('Item removed successfully')

      const itemInDb = await db.collection('items').findOne({ _id: mockItem.insertedId })
      expect(itemInDb).toBeNull()
    })
  })
})
