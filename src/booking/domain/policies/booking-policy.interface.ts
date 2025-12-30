export interface BookingPolicy {
  validate(input: { startTime: Date; endTime: Date; now: Date }): void;
}
