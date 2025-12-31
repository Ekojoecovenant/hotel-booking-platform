/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Booking } from '../../../domain/booking.entity';
import { ConfirmBookingUseCase } from './confirm-booking.usecase';

class FakeBookingRepository {
  private booking: any;

  constructor(booking?: any) {
    this.booking = booking;
  }

  findById() {
    return this.booking;
  }

  save(booking: any) {
    this.booking = booking;
  }
}

class FakePaymentService {
  constructor(private success: boolean) {}

  charge() {
    return { success: this.success };
  }
}

it('confirms a booking when payment succeeds', async () => {
  const booking = Booking.create({
    id: 'booking-1',
    resourceId: 'room-1',
    userId: 'user-1',
    startTime: new Date(Date.now() + 3600000),
    endTime: new Date(Date.now() + 7200000),
  });

  const repo = new FakeBookingRepository(booking);
  const payment = new FakePaymentService(true);

  const useCase = new ConfirmBookingUseCase(repo as any, payment as any);

  const result = await useCase.execute({
    bookingId: 'booking-1',
  });

  expect(result.bookingId).toBe('booking-1');
  expect(result.events.length).toBeGreaterThan(0);
});

it('fails if payment does not succeed', async () => {
  const booking = Booking.create({
    id: 'booking-1',
    resourceId: 'room-1',
    userId: 'user-1',
    startTime: new Date(Date.now() + 3600000),
    endTime: new Date(Date.now() + 7200000),
  });

  const repo = new FakeBookingRepository(booking);
  const payment = new FakePaymentService(false);

  const useCase = new ConfirmBookingUseCase(repo as any, payment as any);

  await expect(useCase.execute({ bookingId: 'booking-1' })).rejects.toThrow();
});
