import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  institute: string;

  @IsNumber()
  @IsOptional()
  startYear?: number;

  @IsNumber()
  @IsOptional()
  endYear?: number;
}
