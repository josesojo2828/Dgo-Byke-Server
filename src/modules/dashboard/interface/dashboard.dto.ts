import { ApiProperty } from '@nestjs/swagger';

export class MenuItemDto {
    @ApiProperty()
    label: string;

    @ApiProperty()
    route: string;

    @ApiProperty()
    icon: string;

    @ApiProperty({ required: false })
    children?: MenuItemDto[];
}

export class DashboardStatsDto {
    @ApiProperty()
    totalUsers: number;

    @ApiProperty()
    activeRaces: number;

    @ApiProperty()
    totalOrganizations: number;
}
