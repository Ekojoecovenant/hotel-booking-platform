import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  resourceId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsISO8601()
  startTime: string;

  @IsISO8601()
  endTime: string;
}
