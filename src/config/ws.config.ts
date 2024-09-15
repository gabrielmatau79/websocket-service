import { registerAs } from '@nestjs/config'

export default registerAs('wsConfig', () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3100,
  wsPort: parseInt(process.env.WS_PORT, 10) || 3200,
  mongoDbUri: process.env.MONGODB_URI || 'mongodb://ws-service:ws-service@localhost:27017/items',
}))

export const WS_PORT = Number(process.env.WS_PORT || 3200)
