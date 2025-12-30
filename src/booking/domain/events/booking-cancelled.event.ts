import { DomainEvent } from '../../../shared/domain/domain-event';

export class BookingCancelledEvent extends DomainEvent {
  constructor(
    public readonly bookingId: string,
    public readonly reason: string,
  ) {
    super();
  }
}
