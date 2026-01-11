import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { FakerInitService } from './faker-init.service';
import { CategoryModule } from 'src/modules/category/category.module';
import { OrganizationModule } from 'src/modules/organization/organization.module';
import { OrganizationMemberModule } from 'src/modules/organization-member/organization-member.module';
import { ParticipantModule } from 'src/modules/participant/participant.module';
import { RaceModule } from 'src/modules/race/race.module';
import { RaceEventModule } from 'src/modules/race-event/race-event.module';
import { TrackModule } from 'src/modules/track/track.module';

@Module({
    imports: [
        UserModule,
        CategoryModule,
        OrganizationModule,
        OrganizationMemberModule,
        ParticipantModule,
        RaceModule,
        RaceEventModule,
        TrackModule
    ],
    controllers: [],
    providers: [
        FakerInitService
    ],
    exports: [FakerInitService]
})
export class FakerInitModule { }
