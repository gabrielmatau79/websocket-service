import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { getLogLevels } from './config/logger.config'
import * as fs from 'fs'

async function bootstrap() {
  const logLevels = getLogLevels()
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  })


  const configService = app.get(ConfigService)
  const logger = new Logger(bootstrap.name)

  // Version
  app.enableVersioning({
    type: VersioningType.URI,
  })

  app.enableCors()

  const port = configService.get('wsConfig.port')
  const wsport = configService.get('wsConfig.wsPort')

  await app.listen(port)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  const appName = packageJson.name
  const appVersion = packageJson.version

  logger.log(
    `Application (${appName} v${appVersion}) running on: ${await app.getUrl()} websocket running ${wsport}`,
  )
}
bootstrap()
