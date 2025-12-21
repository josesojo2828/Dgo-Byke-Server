import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RaceEventService } from '../service/race-event.service';
import { CreateRaceEventDto, UpdateRaceEventDto } from '../interface/race-event.dto';

@Controller('race-events') // Pluralizado manualmente en la ruta
export class RaceEventController {
  constructor(private readonly service: RaceEventService) {}

  @Post()
  create(@Body() createDto: CreateRaceEventDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateRaceEventDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
