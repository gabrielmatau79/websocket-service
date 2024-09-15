import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { WebsocketService } from './websocket.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { WS_PORT } from 'src/config/ws.config'
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { WebsocketExceptionsFilter } from './filters/websocket-exceptions.filter'
import { Server, Socket } from 'socket.io'

@WebSocketGateway(WS_PORT, {
  cors: {
    origin: '*',
  },
})
@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger

  constructor(private readonly websocketService: WebsocketService) {
    this.logger = new Logger(WebsocketGateway.name)
  }

  @WebSocketServer()
  server: Server

  /**
   * Handles client connection events.
   * @param {Socket} client - The client socket object.
   */
  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected ${client.id}`)
  }

  /**
   * Handles client disconnection events.
   * @param {Socket} client - The client socket object.
   */
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected ${client.id}`)
  }

  /**
   * Called after the WebSocket server is initialized.
   */
  afterInit(Server: any): void {
    this.logger.log(`WebSocket server initialized ${Server}`)
  }

  @SubscribeMessage('requestItem')
  async handleRequestItem(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const response = await this.processJsonRpcRequest(data)
    client.send(response)
  }

  private async processJsonRpcRequest(data: any) {
    const { jsonrpc, method, params, id } = data

    if (!this.isValidJsonRpcRequest(jsonrpc, id)) {
      return this.buildRpcError(id, -32600, 'Invalid Request')
    }

    try {
      switch (method) {
        case 'createItem':
          return await this.websocketService.create(params as CreateItemDto, id)
        case 'findAllItems':
          return await this.websocketService.findAll(id)
        case 'findOneItem':
          return await this.websocketService.findOne(params.id, id)
        case 'updateItem':
          return await this.websocketService.update(params as UpdateItemDto, id)
        case 'removeItem':
          return await this.websocketService.remove(params.id, id)
        default:
          return this.buildRpcError(id, -32601, 'Method not found')
      }
    } catch (error) {
      return this.buildRpcError(id, -32000, error.message)
    }
  }

  private isValidJsonRpcRequest(jsonrpc: string, id: any): boolean {
    return jsonrpc === '2.0' && (typeof id === 'string' || typeof id === 'number')
  }

  private buildRpcError(id: string | number | null, code: number, message: string): any {
    return {
      jsonrpc: '2.0',
      error: {
        code: code,
        message: message,
      },
      id: id,
    }
  }
}
