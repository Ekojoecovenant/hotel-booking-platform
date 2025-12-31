import { Body, Controller, Param, Post } from '@nestjs/common';
import { ConfirmBookingUseCase } from '../../application/use-cases/confirm-booking/confirm-booking.usecase';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking/create-booking.usecase';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking/cancel-booking.usecase';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CancelBookingDto } from './dtos/cancel-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBooking: CreateBookingUseCase,
    private readonly confirmBooking: ConfirmBookingUseCase,
    private readonly cancelBooking: CancelBookingUseCase,
  ) {}

  // Create Booking Endpint
  @Post()
  async create(@Body() dto: CreateBookingDto) {
    return this.createBooking.execute({
      resourceId: dto.resourceId,
      userId: dto.userId,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    });
  }

  // Confirm booking endpoint
  @Post(':id/confirm')
  async confirm(@Param('id') bookingId: string) {
    return this.confirmBooking.execute({ bookingId });
  }

  // Cancel booking endpoint
  @Post(':id/cancel')
  async cancel(@Param('id') bookingId: string, @Body() dto: CancelBookingDto) {
    return this.cancelBooking.execute({
      bookingId,
      reason: dto.reason,
    });
  }
}
