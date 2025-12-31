export class ApplicationError extends Error {}

export class BookingNotFoundError extends ApplicationError {}
export class BookingUnavailablerror extends ApplicationError {}
export class PaymentFailedError extends ApplicationError {}
