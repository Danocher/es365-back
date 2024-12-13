import {Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Iuser } from 'src/types/types';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService, 
        private prisma: PrismaService,
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
        const userData = await this.prisma.user.findUnique({where: {id}})
        return {
          user: userData,
          token: this.jwtService.sign({id: user.id, email: user.email}),
          refreshToken: this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '1d'})
        };
      }
      async getNewTokens(refreshToken: string) {
        const userData = await this.jwtService.verify(refreshToken);
        return {
          token: this.jwtService.sign({id: userData.id, email: userData.email}),
          // refreshToken: this.jwtService.sign({id: userData.id, email: userData.email}, {expiresIn: '1d'})
        };
    }
}
