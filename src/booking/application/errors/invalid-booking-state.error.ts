export class InvalidBookingStateError extends Error {
  constructor(message: string) {
    super(message);
  }
}
