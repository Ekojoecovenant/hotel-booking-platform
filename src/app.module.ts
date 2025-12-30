import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [BookingModule, ResourceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
