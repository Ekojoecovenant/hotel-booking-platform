import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { PrismaClient } from '@prisma/client/extension';
import { CreateBookingUseCase } from '../application/use-cases/create-booking/create-booking.usecase';
import { ConfirmBookingUseCase } from '../application/use-cases/confirm-booking/confirm-booking.usecase';
import { CancelBookingUseCase } from '../application/use-cases/cancel-booking/cancel-booking.usecase';
import { PrismaBookingRepository } from './persistence/booking.repository.prisma';
import { PaystackPaymentService } from './payments/paystack-payment.service';
import {
  BOOKING_REPOSITORY,
  PAYMENT_SERVICE,
} from '../application/ports/tokens';

@Module({
  controllers: [BookingController],
  providers: [
    PrismaClient,

    // Use cases
    CreateBookingUseCase,
    ConfirmBookingUseCase,
    CancelBookingUseCase,

    // Repository binding
    {
      provide: BOOKING_REPOSITORY,
      useClass: PrismaBookingRepository,
    },

    // Payment binding
    {
      provide: PAYMENT_SERVICE,
      useClass: PaystackPaymentService,
    },
  ],
})
export class BookingModule {}
