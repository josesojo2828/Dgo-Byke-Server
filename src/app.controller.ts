import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { DataFixtureService } from './shared/service/datafixture.service';
import { FakerInitService } from './shared/faker/faker-init.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataFixtureService: DataFixtureService,
    private readonly fakerInitService: FakerInitService,
  ) { }

  @Get()
  @Render('feature/public/landing')
  landing() {

    return {};
  }


}
