import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { PrismaClient } from '@prisma/client/extension';
import { CreateBookingUseCase } from '../application/use-cases/create-booking/create-booking.usecase';
import { ConfirmBookingUseCase } from '../application/use-cases/confirm-booking/confirm-booking.usecase';
import { CancelBookingUseCase } from '../application/use-cases/cancel-booking/cancel-booking.usecase';
import { BookingRepository } from '../application/ports/booking-repository.port';
import { PrismaBookingRepository } from './persistence/booking.repository.prisma';
import { PaymentService } from '../application/ports/payment-service.port';
import { PaystackPaymentService } from './payments/paystack-payment.service';

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
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },

    // Payment binding
    {
      provide: PaymentService,
      useClass: PaystackPaymentService,
    }
  ],
})
export class BookingModule {}

git add src/booking/infrastructure/controllers
git commit -m "feat(infrastructure): add booking HTTP controllers"
