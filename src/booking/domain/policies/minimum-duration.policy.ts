import { InvalidBookingTimeError } from '../booking.errors';
import { BookingPolicy } from './booking-policy.interface';

export class MinimumDurationPolicy implements BookingPolicy {
  constructor(private readonly minimumMinutes: number) {}

  validate({
    startTime,
    endTime,
  }: {
    startTime: Date;
    endTime: Date;
    now: Date;
  }): void {
    const durationMs = endTime.getTime() - startTime.getTime();

    const durationMinutes = durationMs / (1000 * 60);

    if (durationMinutes < this.minimumMinutes) {
      throw new InvalidBookingTimeError(
        `Booking must be at least ${this.minimumMinutes} minutes long`,
      );
    }
  }
}
