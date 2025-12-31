/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Booking } from '../../../domain/booking.entity';
import { CancelBookingUseCase } from './cancel-booking.usecase';

class FakeBookingRepository {
  private booking: any;

  constructor(booking: any) {
    this.booking = booking;
  }

  findById() {
    return this.booking;
  }

  save(booking: any) {
    this.booking = booking;
  }
}

it('cancels a confirmed booking', async () => {
  const booking = Booking.create({
    id: 'booking-1',
    resourceId: 'room-1',
    userId: 'user-1',
    startTime: new Date(Date.now() + 3600000),
    endTime: new Date(Date.now() + 7200000),
  });

  booking.confirm();

  const repo = new FakeBookingRepository(booking);
  const useCase = new CancelBookingUseCase(repo as any);

  const result = await useCase.execute({
    bookingId: 'booking-1',
    reason: 'Change of plans',
  });

  expect(result.bookingId).toBe('booking-1');
  expect(result.events.length).toBeGreaterThan(0);
});

it('fails if booking does not exist', async () => {
  const repo = new FakeBookingRepository(null);
  const useCase = new CancelBookingUseCase(repo as any);

  await expect(
    useCase.execute({
      bookingId: 'missing',
      reason: 'N/A',
    }),
  ).rejects.toThrow();
});
