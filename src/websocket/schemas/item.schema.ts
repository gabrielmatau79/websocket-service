import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

export type ItemDocument = HydratedDocument<Item>

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true, index: true })
  name: string

  @Prop()
  description?: string

  @Prop({ required: true })
  price: number
}

export const ItemSchema = SchemaFactory.createForClass(Item)
