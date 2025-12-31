/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient } from '@prisma/client/extension';
import { BookingRepository } from '../../application/ports/booking-repository.port';
import { Booking } from '../../domain/booking.entity';

export class PrismaBookingRepository implements BookingRepository {
  constructor(private prisma: PrismaClient) {}

  async save(booking: Booking): Promise<void> {
    await this.prisma.booking.upsert({
      where: { id: booking.getId() },
      update: {
        startTime: booking.getStartTime(),
        endTime: booking.getEndTime(),
        status: booking.getStatus(),
        updatedAt: new Date(),
      },
      create: {
        id: booking.getId(),
        resourceId: booking.getResourceId(),
        userId: booking.getUserId(),
        startTime: booking.getStartTime(),
        endTime: booking.getEndTime(),
        status: booking.getStatus(),
      },
    });
  }

  async findById(id: string): Promise<Booking | null> {
    const record = await this.prisma.booking.findUnique({ where: { id } });
    if (!record) return null;

    return Booking.rehydrate({
      id: record.id,
      resourceId: record.resourceId,
      userId: record.userId,
      startTime: record.startTime,
      endTime: record.endTime,
      status: record.status,
      createdAt: record.createdAt,
    });
  }
}
