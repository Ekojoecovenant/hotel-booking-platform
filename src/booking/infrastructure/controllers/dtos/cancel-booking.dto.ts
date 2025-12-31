import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelBookingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  reason: string;
}
