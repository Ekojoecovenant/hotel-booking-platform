import { Inject } from '@nestjs/common';
import {
  BookingNotFoundError,
  PaymentFailedError,
} from '../../application-errors';
import type { BookingRepository } from '../../ports/booking-repository.port';
import type { PaymentService } from '../../ports/payment-service.port';
import { ConfirmBookingDTO } from './confirm-booking.dto';
import { BOOKING_REPOSITORY, PAYMENT_SERVICE } from '../../ports/tokens';

/**
 * ConfirmBooking turns a "promise" into a "commitment" by verifying payment and locking the booking
 */

export class ConfirmBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,

    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: PaymentService,
  ) {}

  async execute(dto: ConfirmBookingDTO) {
    // Load the booking
    const booking = await this.bookingRepository.findById(dto.bookingId);

    // Prevents ghost payment
    if (!booking) {
      throw new BookingNotFoundError('Booking does not exist');
    }

    // Reference ties money
    const paymentResult = await this.paymentService.charge({
      userId: booking.getUserId(),
      amount: 10000, // placeholder
      reference: booking.getId(),
    });

    if (!paymentResult.success) {
      throw new PaymentFailedError('Payment could not be completed');
    }

    // confirm booking
    booking.confirm();

    await this.bookingRepository.save(booking);

    return {
      bookingId: booking.getId(),
      events: booking.pullDomainEvents(),
    };
  }
}
