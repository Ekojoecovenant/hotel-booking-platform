import { InvalidBookingTimeError } from '../booking.errors';
import { BookingPolicy } from './booking-policy.interface';

export class BookingWindowPolicy implements BookingPolicy {
  constructor(private readonly maxDaysAhead: number = 180) {}

  validate({
    startTime,
    endTime,
    now,
  }: {
    startTime: Date;
    endTime: Date;
    now: Date;
  }): void {
    if (startTime <= now) {
      throw new InvalidBookingTimeError('Booking must start in the future');
    }

    const maxBookingDate = new Date(now);
    maxBookingDate.setDate(maxBookingDate.getDate() + this.maxDaysAhead);

    if (startTime > maxBookingDate) {
      throw new InvalidBookingTimeError(
        `Booking cannot be more than ${this.maxDaysAhead} days ahead`,
      );
    }

    if (endTime <= startTime) {
      throw new InvalidBookingTimeError('End time must be after start time');
    }
  }
}
