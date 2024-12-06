import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { genSalt, hash } from 'bcrypt';
@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}
    async findOne(email:string){
        return this.prisma.user.findUnique({
            where:{
                mail: email
            }
        })
    }
    async createUser(mail: string, name: string, password: string, phonenum: string, company: string, inn:string, bik:string, ogrn:string){ 
        const user = await this.prisma.user.findUnique({
            where:{
                mail:mail
            }
        })
        if(user){
            throw new BadRequestException('Пользователь с таким email уже существует')
        }
        const salt = await genSalt(10)
        const hashed = await hash(password, salt)
        return await this.prisma.user.create({
            data:{
                name,
                mail,
                password:hashed,
                phonenum,
                company,
                inn,
                bik,
                ogrn,
            }
        })
    }
    async deleteUser(){
        return await this.prisma.user.deleteMany()
          
    }
}
