import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Item } from './schemas/item.schema'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'

@Injectable()
export class WebsocketService {
  private logger: Logger

  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {
    this.logger = new Logger(WebsocketService.name)
  }

  async create(createItemDto: CreateItemDto, id: string): Promise<any> {
    this.logger.log(`[create item] initialize create service`)
    try {
      const createdItem = new this.itemModel(createItemDto)
      const savedItem = await createdItem.save()
      return this.buildRpcResponse(id, savedItem)
    } catch (error) {
      return this.buildRpcError(id, error.message)
    }
  }

  async findAll(id: string): Promise<any> {
    this.logger.log(`[findAll items] initialize findAll service`)
    try {
      const items = await this.itemModel.find().exec()
      return this.buildRpcResponse(id, items)
    } catch (error) {
      return this.buildRpcError(id, error.message)
    }
  }

  async findOne(id: string, rpcId: string): Promise<any> {
    this.logger.log(`[findOne item] initialize findOne service`)
    try {
      const item = await this.itemModel.findById(id).exec()
      if (!item) throw new Error('Item not found')
      return this.buildRpcResponse(rpcId, item)
    } catch (error) {
      return this.buildRpcError(rpcId, error.message)
    }
  }

  async update(updateItemDto: UpdateItemDto, id: string): Promise<any> {
    this.logger.log(`[update item] initialize update service`)
    try {
      const { id: itemId, ...updateData } = updateItemDto
      const updatedItem = await this.itemModel.findByIdAndUpdate(itemId, updateData, { new: true }).exec()
      return this.buildRpcResponse(id, updatedItem)
    } catch (error) {
      return this.buildRpcError(id, error.message)
    }
  }

  async remove(id: string, rpcId: string): Promise<any> {
    this.logger.log(`[remove item] initialize remove service`)
    try {
      const removedItem = await this.itemModel.findByIdAndRemove(id).exec()
      if (!removedItem) throw new Error('Item not found')
      return this.buildRpcResponse(rpcId, removedItem)
    } catch (error) {
      return this.buildRpcError(rpcId, error.message)
    }
  }

  private buildRpcResponse(id: string, result: any): any {
    return {
      jsonrpc: '2.0',
      result: result,
      id: id,
    }
  }

  private buildRpcError(id: string, error: string): any {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error,
      },
      id: id,
    }
  }
}
