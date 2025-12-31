/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ConfirmBookingUseCase } from '../../application/use-cases/confirm-booking/confirm-booking.usecase';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking/create-booking.usecase';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking/cancel-booking.usecase';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBooking: CreateBookingUseCase,
    private readonly confirmBooking: ConfirmBookingUseCase,
    private readonly cancelBooking: CancelBookingUseCase,
  ) {}

  // Create Booking Endpint
  @Post()
  async create(@Body() body: any) {
    return this.createBooking.execute({
      resourceId: body.resourceId,
      userId: body.userId,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    });
  }

  // Confirm booking endpoint
  @Post(':id/confirm')
  async confirm(@Param('id') bookingId: string) {
    return this.confirmBooking.execute({ bookingId });
  }

  // Cancel booking endpoint
  @Post(':id/cancel')
  async cancel(
    @Param('id') bookingId: string,
    @Body() body: { reason: string },
  ) {
    return this.cancelBooking.execute({
      bookingId,
      reason: body.reason,
    });
  }
}
