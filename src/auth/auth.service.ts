import {Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Iuser } from 'src/types/types';
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService, 
        private readonly jwtService: JwtService){}
    async validateUser(email:string, password:string){
        const user: User = await this.userService.findOne(email)
        const passwordCkeck = await bcrypt.compare(password, user.password)
        if(user && passwordCkeck===true){
            return user
        }
        throw new UnauthorizedException('Incorrect password or email')
    }
    async login(user: Iuser) {
        const {id, email} = user
        return {
          id, email,
          token: this.jwtService.sign({id: user.id, email: user.email}),
        };
      }
}
