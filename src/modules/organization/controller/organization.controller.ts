import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrganizationService } from '../service/organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interface/organization.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) { }

  @Get('v1/me')
  @UseGuards(SessionAuthGuard)
  // No requiere permiso de sistema específico, solo estar logueado. 
  // El servicio valida si tiene org.
  async getMyOrganization(@CurrentUser() user: any) {
    return this.service.findByOwner(user.id);
  }

  // ============================================================
  // 1. OBTENER INFO PÚBLICA (Para la Landing Page)
  // URL: /organizations/public/club-mtb-guarico
  // ============================================================
  @Get('public/:slug')
  async getPublicInfoBySlug(@Param('slug') slug: string) {
    return this.service.getPublicInfoBySlug(slug);
  }

  // ============================================================
  // 2. UNIRSE A LA ORGANIZACIÓN (Privado - Requiere Login)
  // URL: POST /organizations/join/club-mtb-guarico
  // ============================================================
  @UseGuards(SessionAuthGuard)
  @Post('join/:slug')
  async joinBySlug(
    @Param('slug') slug: string,
    @Req() req: any
  ) {
    // El usuario (req.user.id) se une a la org identificada por el slug
    return this.service.joinBySlug(req.user.id, slug);
  }
  // ==========================================
  // RUTAS DE ADMINISTRACIÓN DE LA ORG
  // ==========================================

  @Post('v1')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Organizations.Create)
  create(@Body() createDto: CreateOrganizationDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @UseGuards(SessionAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Organizations.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Organizations.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateOrganizationDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Organizations.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
