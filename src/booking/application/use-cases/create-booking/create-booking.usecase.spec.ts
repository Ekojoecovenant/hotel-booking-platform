/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BookingPolicyRunner } from '../../../domain/policies/booking-policy-runner';
import { BookingWindowPolicy } from '../../../domain/policies/booking-window.policy';
import { MinimumDurationPolicy } from '../../../domain/policies/minimum-duration.policy';
import { CreateBookingUseCase } from './create-booking.usecase';

class FakeBookingRepository {
  public savedBooking: any = null;

  save(booking: any) {
    this.savedBooking = booking;
  }

  findById() {
    return null;
  }
}

class FakeAvailabilityService {
  constructor(private available: boolean) {}

  isAvailable() {
    return this.available;
  }
}

const policyRunner = new BookingPolicyRunner([
  new BookingWindowPolicy(),
  new MinimumDurationPolicy(60),
]);

it('creates a booking when input is valid and available', async () => {
  const repo = new FakeBookingRepository();
  const availability = new FakeAvailabilityService(true);

  const useCase = new CreateBookingUseCase(
    repo as any,
    availability as any,
    policyRunner,
  );

  const result = await useCase.execute({
    resourceId: 'room-1',
    userId: 'user-1',
    startTime: new Date(Date.now() + 3600000),
    endTime: new Date(Date.now() + 7200000),
  });

  expect(repo.savedBooking).toBeDefined();
  expect(result.bookingId).toBeDefined();
  expect(result.events.length).toBeGreaterThan(0);
});

it('fails if resource is unavailable', async () => {
  const repo = new FakeBookingRepository();
  const availability = new FakeAvailabilityService(false);

  const useCase = new CreateBookingUseCase(
    repo as any,
    availability as any,
    policyRunner,
  );

  await expect(
    useCase.execute({
      resourceId: 'room-1',
      userId: 'user-1',
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 7200000),
    }),
  ).rejects.toThrow();
});
