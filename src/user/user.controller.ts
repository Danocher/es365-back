import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/create')
  async createUser(@Body() dto:RegDto){
    return await this.userService.createUser(dto.email, dto.name, dto.password, dto.phonenum, dto.company, dto.inn, dto.bik, dto.ogrn)  
  }
}
