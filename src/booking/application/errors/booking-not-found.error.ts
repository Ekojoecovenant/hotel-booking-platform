export class BookingNotFoundError extends Error {
  constructor(bookingId: string) {
    super(`Booking with id ${bookingId} was not found`);
  }
}
