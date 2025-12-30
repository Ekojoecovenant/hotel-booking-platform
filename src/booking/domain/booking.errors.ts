export class InvalidBookingStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBookingStateError';
  }
}

export class InvalidBookingTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBookingTimeError';
  }
}
