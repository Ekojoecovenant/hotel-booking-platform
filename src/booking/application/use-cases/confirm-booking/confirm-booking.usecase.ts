import { BookingNotFoundError, PaymentFailedError } from '../../application-errors';
import { BookingRepository } from '../../ports/booking-repository.port';
import { PaymentService } from '../../ports/payment-service.port';
import { ConfirmBookingDTO } from './confirm-booking.dto';

export class ConfirmBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
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
