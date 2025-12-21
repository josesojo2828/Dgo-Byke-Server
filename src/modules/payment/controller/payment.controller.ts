import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../interface/payment.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentController {
  constructor(private readonly service: PaymentService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Payments.Create)
  create(@Body() createDto: CreatePaymentDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Payments.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Payments.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Payments.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdatePaymentDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Payments.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
