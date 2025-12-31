/**
 * CancelBooking safely releases a promise and restores availability without lying to the system.
 *
 * When a booking is cancelled:
 * - The booking still exists
 * - Its history still exists
 * - Its events still exists
 * - Availability is restored (indirectly)
 */

import { BookingNotFoundError } from '../../application-errors';
import { BookingRepository } from '../../ports/booking-repository.port';
import { CancelBookingDTO } from './cancel-booking.dto';

export class CancelBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(dto: CancelBookingDTO) {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new BookingNotFoundError('Booking does not exist');
    }

    // cancel via domain
    booking.cancel(dto.reason);

    // save and return events
    await this.bookingRepository.save(booking);

    return {
      bookingId: booking.getId(),
      events: booking.pullDomainEvents(),
    };
  }
}
