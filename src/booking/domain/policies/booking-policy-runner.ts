import { BookingPolicy } from './booking-policy.interface';

export class BookingPolicyRunner {
  constructor(private readonly policies: BookingPolicy[]) {}

  validate(input: { startTime: Date; endTime: Date; now: Date }) {
    for (const policy of this.policies) {
      policy.validate(input);
    }
  }
}
