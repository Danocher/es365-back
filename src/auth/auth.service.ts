import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(private userService: UserService){}
    async validateUser(email:string, password:string){
        const user: User = await this.userService.findOne(email)
        const passwordCkeck = await bcrypt.compare(password, user.password)
        if(user && passwordCkeck===true){
            return user
        }
        throw new BadRequestException('Incorrect password or email')
    }
}
