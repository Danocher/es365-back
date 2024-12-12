import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Get('/monthly-sell')
  @UseGuards(JwtAuthGuard)
  async getMonthlySell(@Req() req){
    const sum = await this.statisticService.getTotalMonthSell(req.user.id)
    return sum._sum
  }
  @Get('/active-managers')
  @UseGuards(JwtAuthGuard)
  async getActiveManegers(@Req() req){
    const sum = await this.statisticService.getActiveManagers(req.user.id)
    return sum._count
  }
  @Get('/product-count')
  @UseGuards(JwtAuthGuard)
  async getProductCount(@Req() req){
    const sum = await this.statisticService.getProductCount(req.user.id)
    return sum._count
  }
  @Get('/monthly-manager-sell')
  @UseGuards(JwtAuthGuard)
  async getMonthlyManagerSell(@Req() req){
    const sum = await this.statisticService.getMonthlyManagerSell(req.user.id)
    return sum
  }
  @Get('/monthly-selected-manager-sell')
  @UseGuards(JwtAuthGuard)
  async getMonthlySelectedManagerSell(@Req() req, @Query('month') month: string){
    const sum = await this.statisticService.getMonthlySelectedManagerSell(req.user.id, Number(month))
    return sum
  }
  @Get('/manager-stats-by-date-range')
  @UseGuards(JwtAuthGuard)
  async getManagerStatsByDateRange(@Req() req, @Query('startDate') startDate: string, @Query('endDate') endDate: string){
    const sum = await this.statisticService.getManagerStatsByDateRange(req.user.id, new Date(startDate), new Date(endDate))
    return sum
  }
}