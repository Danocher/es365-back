import { Controller, Get, UseGuards, Request, Post, Body, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderDto } from './order-dto';
import { IsOpenGuard } from 'src/shift/guard/shift-guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getOrders(@Request() req){
    return await this.orderService.getOrders(req.user.id)
  }
  @Post('create')
  @UseGuards(JwtAuthGuard, IsOpenGuard)
  async createOrders(@Request() req, @Body() dto:OrderDto){
    return await this.orderService.createOrders(req.user_id, dto, req.cookies['shift'])
  }
  @Get('client')
  @UseGuards(JwtAuthGuard)
  async getClientOrders(@Request() req, @Query('client_id') client_id:string){
    return await this.orderService.getClientOrders(client_id, req.user.id)
  }
  @Get('manager')
  @UseGuards(JwtAuthGuard)
  async getManagerOrders(@Request() req, @Query('manager_id') manager_id:string){
    return await this.orderService.getManagerOrders( manager_id, req.user.id,)
  }
  @Get('interval')
  @UseGuards(JwtAuthGuard)
  async getInterval(@Request() req, @Query('start') startDate:string, @Query('end') endDate:string){
    const start_date = new Date(startDate)
    const end_date = new Date(endDate)
    return await this.orderService.findOrderByInterval(req.user.id, start_date, end_date)
  }
  @Get('month/sell')
  @UseGuards(JwtAuthGuard)
  async getMonthlySell(@Request() req){
    return await this.orderService.findMonthlySell(req.user.id)
  }
  @Get('monthly/profit')
  @UseGuards(JwtAuthGuard)
  async getMonthlyProfit(@Request() req){
    return await this.orderService.findMonthlyProfit(req.user.id)
  }
  @Get('interval/manager')
  @UseGuards(JwtAuthGuard)
  async getManagerIntervalOrders(@Request() req, @Query('start') startDate:string, @Query('end') endDate:string, @Query('manager') manager_id:string){
    const start_date = new Date(startDate)
    const end_date = new Date(endDate)
    return await this.orderService.findManagerOrdersByInterval(req.user.id, start_date, end_date, manager_id)
  }
  @Get('interval/client')
  @UseGuards(JwtAuthGuard)
  async getClientIntervalOrders(@Request() req, @Query('start') startDate:string, @Query('end') endDate:string, @Query('client') client_id:string){
    const start_date = new Date(startDate)
    const end_date = new Date(endDate)
    return await this.orderService.findClientOrdersByInterval(req.user.id, start_date, end_date, client_id)
  }
}
