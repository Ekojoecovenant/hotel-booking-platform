import { DomainEvent } from '../../shared/domain/domain-event';
import { BookingStatus } from './booking-status.enum';
import {
  InvalidBookingStateError,
  InvalidBookingTimeError,
} from './booking.errors';
import { BookingCancelledEvent } from './events/booking-cancelled.event';
import { BookingConfirmedEvent } from './events/booking-confirmed.event';

export class Booking {
  private status: BookingStatus;
  private readonly domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly id: string,
    private readonly resourceId: string,
    private readonly userId: string,
    private readonly startTime: Date,
    private readonly endTime: Date,
    status: BookingStatus,
    private readonly createdAt: Date,
  ) {
    this.status = status;
  }

  // FACTORY
  static create(props: {
    id: string;
    resourceId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
  }): Booking {
    if (props.startTime >= props.endTime) {
      throw new InvalidBookingTimeError('Start time must be before end time');
    }

    return new Booking(
      props.id,
      props.resourceId,
      props.userId,
      props.startTime,
      props.endTime,
      BookingStatus.PENDING,
      new Date(),
    );
  }

  // BEHAVIOR
  confirm() {
    if (this.status !== BookingStatus.PENDING) {
      throw new InvalidBookingStateError(
        'Only pending bookings can be confirmed',
      );
    }
    this.status = BookingStatus.CONFIRMED;

    this.record(new BookingConfirmedEvent(this.id));
  }

  cancel(reason: string) {
    if (
      this.status !== BookingStatus.PENDING &&
      this.status !== BookingStatus.CONFIRMED
    ) {
      throw new InvalidBookingStateError(
        'Only pending or confirmed bookings can be cancelled',
      );
    }
    this.status = BookingStatus.CANCELLED;

    this.record(new BookingCancelledEvent(this.id, reason));
  }

  complete(now: Date) {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new InvalidBookingStateError(
        'Only confirmed bookings can be completed',
      );
    }

    if (now < this.endTime) {
      throw new InvalidBookingStateError(
        'Booking cannot be completed before end time',
      );
    }

    this.status = BookingStatus.COMPLETED;
  }

  expire(now: Date) {
    if (this.status !== BookingStatus.PENDING)
      throw new InvalidBookingStateError('Only pending bookings can expired');

    if (now < this.startTime) {
      throw new InvalidBookingStateError(
        'Booking cannot expire before start time',
      );
    }

    this.status = BookingStatus.EXPIRED;
  }

  // READ-ONLY GETTERS
  getStatus() {
    return this.status;
  }

  getTimeRange() {
    return { start: this.startTime, end: this.endTime };
  }

  // HELPERS
  protected record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
