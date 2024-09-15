import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WebsocketModule } from './websocket/websocket.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import wsConfig from './config/ws.config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    WebsocketModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [wsConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('wsConfig.mongoDbUri'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
