import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CaptureEventDto } from './capture-event.dto';

export class SyncBulkEventsDto {
    @IsUUID()
    raceId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CaptureEventDto)
    events: CaptureEventDto[];
}