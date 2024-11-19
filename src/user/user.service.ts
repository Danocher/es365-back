import { Injectable } from '@nestjs/common';
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
    async createUser(mail: string, name: string, password: string, phonenum: number, company: string){
        const salt = await genSalt(10)
        const hashed = await hash(password, salt)
        return await this.prisma.user.create({
            data:{
                name,
                mail,
                password:hashed,
                phonenum,
                company,
            }
        })
    }
}
