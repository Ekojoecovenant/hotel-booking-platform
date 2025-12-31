import { Inject } from '@nestjs/common';
import { Booking } from '../../../domain/booking.entity';
import { BookingPolicyRunner } from '../../../domain/policies/booking-policy-runner';
import { BookingUnavailablerror } from '../../application-errors';
import type { AvailabilityService } from '../../ports/availability-service.port';
import type { BookingRepository } from '../../ports/booking-repository.port';
import { CreateBookingDTO } from './create-booking.dto';
import { BOOKING_REPOSITORY } from '../../ports/tokens';

/**
 * CreateBooking use case is the only safe way the outside world is allowed to create a booking.
 */

export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    private readonly availabilityService: AvailabilityService,
    private readonly policyRunner: BookingPolicyRunner,
  ) {}

  async execute(dto: CreateBookingDTO) {
    const isAvailable = await this.availabilityService.isAvailable({
      resourceId: dto.resourceId,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    if (!isAvailable) {
      throw new BookingUnavailablerror(
        'Resource is not available for the selected time range',
      );
    }

    this.policyRunner.validate({
      startTime: dto.startTime,
      endTime: dto.endTime,
      now: new Date(),
    });

    const booking = Booking.create({
      id: crypto.randomUUID(),
      resourceId: dto.resourceId,
      userId: dto.userId,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    await this.bookingRepository.save(booking);

    return {
      bookingId: booking.getId(),
      events: booking.pullDomainEvents(),
    };
  }
}
