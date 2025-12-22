import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BicycleService } from '../service/bicycle.service';
import { CreateBicycleDto, UpdateBicycleDto } from '../interface/bicycle.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';
import { UserService } from 'src/modules/user/service/user.service';
import { CyclistProfileService } from 'src/modules/user/service/cyclist-profile.service';
import { BusinessLogicException, GlobalExceptionFilter } from 'src/shared/error';

@Controller('bicycles')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class BicycleController {
  constructor(
    private readonly service: BicycleService,
    private readonly userService: UserService,
    private readonly profileService: CyclistProfileService
  ) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Bicycles.Create)
  create(@Body() createDto: CreateBicycleDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Bicycles.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Bicycles.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Bicycles.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateBicycleDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Bicycles.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('v1/mine/:id')
  async getMyBikes(@Param('id') userId: string) {
    // Primero obtenemos el ID del perfil del ciclista usando el ID del usuario
    const profile = await this.profileService.findOneByUserId(userId);
    if (!profile) return []; // Si no tiene perfil, no tiene bicis
    return this.service.findAllByProfile(profile.id);
  }

  // 2. Crear bicicleta para MI perfil
  @Post('v1/mine/:id')
  async createMyBike(@Param('id') userId: string, @Body() createDto: CreateBicycleDto) {
    const profile = await this.profileService.findOneByUserId(userId);
    if (!profile) throw new BusinessLogicException('Debes crear un perfil de ciclista primero');

    console.log(profile);

    // Forzamos el ID del perfil al del usuario logueado por seguridad
    createDto.cyclistProfileId = profile.id;

    return this.service.create(createDto);
  }
}
