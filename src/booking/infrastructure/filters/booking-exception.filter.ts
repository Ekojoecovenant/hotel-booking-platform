import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BookingNotFoundError } from '../../application/errors/booking-not-found.error';
import { InvalidBookingStateError } from '../../application/errors/invalid-booking-state.error';
import { PaymentFailedError } from '../../application/errors/payment-failed.error';

@Catch(Error)
export class BookingExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof BookingNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: exception.message,
      });
    }

    if (exception instanceof InvalidBookingStateError) {
      return response.status(HttpStatus.CONFLICT).json({
        messagE: exception.message,
      });
    }

    if (exception instanceof PaymentFailedError) {
      return response.status(HttpStatus.PAYMENT_REQUIRED).json({
        message: exception.message,
      });
    }

    // Fallback (true 500s)
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}
