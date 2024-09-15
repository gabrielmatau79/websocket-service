import { IsString, IsOptional, IsNumber } from 'class-validator'

export class CreateItemDto {
  @IsString()
  readonly name: string

  @IsString()
  @IsOptional()
  readonly description?: string

  @IsNumber()
  readonly price: number
}
