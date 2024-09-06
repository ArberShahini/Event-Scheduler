import { Time } from "@angular/common";

export interface Events{
    id: number;
    name: string;
    scheduleDate: Date;
    description: string;
    startTime: Time;
    endTime: Time;
}