import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from '../service/public.service';
import { PaginationDto } from '../interface/public.dto';
import { FakerInitService } from 'src/shared/faker/faker-init.service';

@Controller('public')
export class PublicController {
    constructor(
        private readonly publicService: PublicService,
        private readonly fakerInitService: FakerInitService
    ) { }

    @Get('init')
    async init() {
        await this.fakerInitService.pipeline();
    }

    @Get('races')
    async getRaces(@Query() query: PaginationDto) {
        return this.publicService.getPublicRaces(query);
    }

    @Get('categories')
    async getCategories() {
        return this.publicService.getCategories();
    }

    @Get('tracks')
    async getTracks() {
        return this.publicService.getTracks();
    }

    @Get('rankings/:raceId')
    async getRankings(@Param('raceId') raceId: string) {
        return this.publicService.getRaceRanking(raceId);
    }
}