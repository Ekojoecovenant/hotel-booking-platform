export interface AvailabilityService {
  isAvailable(input: {
    resourceId: string;
    startTime: Date;
    endTime: Date;
  }): Promise<boolean>;
}
