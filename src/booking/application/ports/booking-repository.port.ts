import { Booking } from '../../domain/booking.entity';

export interface BookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
}
