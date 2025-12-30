import { DomainEvent } from '../../../shared/domain/domain-event';

export class BookingConfirmedEvent extends DomainEvent {
  constructor(public readonly bookingId: string) {
    super();
  }
}
