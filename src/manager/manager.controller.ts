import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req){
    return await this.managerService.getManagers(req.user.id)
  }
  
}
