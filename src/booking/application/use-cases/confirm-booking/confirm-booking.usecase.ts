import { Inject } from '@nestjs/common';
import type { BookingRepository } from '../../ports/booking-repository.port';
import type { PaymentService } from '../../ports/payment-service.port';
import { ConfirmBookingDTO } from './confirm-booking.dto';
import { BOOKING_REPOSITORY, PAYMENT_SERVICE } from '../../ports/tokens';
import { BookingNotFoundError } from '../../errors/booking-not-found.error';
import { PaymentFailedError } from '../../errors/payment-failed.error';

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
      throw new BookingNotFoundError(dto.bookingId);
    }

    if (!booking.canBePaid()) {
      return; // idempotent exit
    }

    // Reference ties money
    const paymentResult = await this.paymentService.charge({
      userId: booking.getUserId(),
      amount: 10000, // placeholder
      reference: booking.getId(),
    });

    if (!paymentResult.success) {
      throw new PaymentFailedError();
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
