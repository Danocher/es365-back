import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { clientDto, clientOne } from './client-dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllClients(@Request() req){
    return await this.clientService.getClients(req.user.id)
  }
  @Post('add')
  @UseGuards(JwtAuthGuard)
  async createClient(@Body() dto:clientDto, @Request() req){
    return await this.clientService.createClient(dto.fullname, dto.phonenum, req.user.id)
  }
  @Get('one')
  @UseGuards(JwtAuthGuard)
  async getOneClient(@Query('client_id') client_id:string, @Request() req){
    return await this.clientService.getOneClient(client_id, req.user.id)
  }
}
