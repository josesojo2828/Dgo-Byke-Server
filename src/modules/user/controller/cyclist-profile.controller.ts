import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Param } from '@nestjs/common';
import { CyclistProfileService } from '../service/cyclist-profile.service';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { CreateCyclistProfileDto, UpdateCyclistProfileDto } from '../interface/ciclist.dto';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';

@Controller('cyclist-profile')
@UseGuards(SessionAuthGuard) // Protegemos toda la ruta
export class CyclistProfileController {
  constructor(private readonly cyclistProfileService: CyclistProfileService) {}

  @Post('/v1/:id')
  create(
    @Param('id') userId: string, 
    @Body() createDto: CreateCyclistProfileDto
  ) {
    // Este endpoint sirve tanto para crear como para editar (Upsert)
    // ideal para el botón "Guardar Perfil" del formulario
    return this.cyclistProfileService.createOrUpdate(userId, createDto);
  }

  @Get('/v1/:id')
  async getMyProfile(@Param('id') userId: string) {
    const profile = await this.cyclistProfileService.findOneByUserId(userId);
    return profile || null; 
  }

  @Patch('/v1/:id')
  update(
    @Param('id') userId: string, 
    @Body() updateDto: UpdateCyclistProfileDto
  ) {
    return this.cyclistProfileService.createOrUpdate(userId, updateDto as CreateCyclistProfileDto);
  }

  @Delete('/v1/:id')
  remove(@Param('id') userId: string) {
    return this.cyclistProfileService.remove(userId);
  }
}