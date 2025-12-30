import { DomainEvent } from '../../../shared/domain/domain-event';

export class BookingCreatedEvent extends DomainEvent {
  constructor(
    public readonly bookingId: string,
    public readonly roomId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
  ) {
    super();
  }
}
