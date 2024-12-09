import { BadRequestException, Body, Controller, Get, Post, Req,  Res, ResponseDecoratorOptions, UseGuards } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsOpenGuard } from './guard/shift-guard';
import { OpenDto } from './shift-dto';
import { Response, Request } from 'express';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}
  @Post('open')
  @UseGuards(JwtAuthGuard)
  async shiftOpen(@Body() dto:OpenDto, @Req() req, @Res() res:Response){
    try {
      const shift = await this.shiftService.open(dto.manager, req.user.id);
      res.cookie('shift', shift.id, { secure: false, httpOnly: true });
      return res.json({ shift: "Смена успешно открыта" });} 
    catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Произошла ошибка при открытии смены.' });
    }
  }
  @Post('close')
  @UseGuards(JwtAuthGuard, IsOpenGuard)
  async shiftClose(@Req() req, @Res() res: Response){
    res.clearCookie('shift')  
    const shiftData =await this.shiftService.close(req.cookies['shift'], req.user.id, res)
    return res.send(shiftData)
  }
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getShifts(@Req() req){
    return await this.shiftService.getShifts(req.user.id) 
  }
}

