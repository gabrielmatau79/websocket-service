import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator'

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string

  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly description?: string

  @IsNumber()
  @IsOptional()
  readonly price?: number
}
