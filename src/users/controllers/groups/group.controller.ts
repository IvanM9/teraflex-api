import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from '../../services/groups/group.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { CurrentUser } from '@security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('group')
@ApiTags('Group')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class GroupController {
  constructor(private service: GroupService) {}

  @Post('add/:id')
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({ summary: 'Asociar paciente a terapista' })
  async addPatient(
    @CurrentUser() user: InfoUserInterface,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      message: await this.service.addPatient(id, user),
    } as ResponseDataInterface;
  }

  @Patch('status/:id')
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({ summary: 'Reasociar/desasociar paciente de terapista' })
  async updateStatusPatient(
    @CurrentUser() user: InfoUserInterface,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      message: await this.service.updateStatusPatient(id, user),
    } as ResponseDataInterface;
  }

  @Get('all')
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({
    summary: 'Obtener todos los pacientes asociados al terapista',
  })
  @ApiQuery({ name: 'status', type: Boolean, required: false })
  async getAllByTherapist(
    @CurrentUser() user: InfoUserInterface,
    @Query('status') status: boolean,
  ) {
    return {
      data: await this.service.getAllByTherapist(user.id, status),
    } as ResponseDataInterface;
  }
}
