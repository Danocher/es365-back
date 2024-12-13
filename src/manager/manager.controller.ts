import { Body, Controller, Delete, Get, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerDto, UpdateManagerDto } from './manager-dto';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req){
    return await this.managerService.getManagers(req.user.id)
  }
  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addManager(@Body() dto:ManagerDto, @Request() req){
    return await this.managerService.addManager(req.user.id, dto.name, dto.phonenum, dto.hour_cost)
  }
  @Get('one')
  @UseGuards(JwtAuthGuard)
  async getOneManager(@Request() req, @Query('manager_id') manager_id:string){
    return await this.managerService.getOne(req.user.id, manager_id)
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteManager(@Request() req, @Query('manager_id') manager_id:string){
    await this.managerService.deleteManager(req.user.id, manager_id)
    return {success: "Менеджер успешно удален"}
  }
  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateManager(@Request() req, @Body() dto:UpdateManagerDto){
    return await this.managerService.updateManager(req.user.id, dto.id, dto.name, dto.phonenum, dto.hour_cost)
  }
  
}
