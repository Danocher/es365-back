import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
