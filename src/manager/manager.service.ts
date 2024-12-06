import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ManagerService {
    constructor(private prisma:PrismaService){}
    async getManagers(id:string){
        return await this.prisma.manager.findMany({
            where:{
                user_id:id
            }
        })
    }
    async addManager(user_id:string, name:string, phonenum:string, hour_cost:number, ){
        return await this.prisma.manager.create({
            data:{
                name,
                phonenum,
                hour_cost,
                user_id
            }
        })
    }
    async getOne(user_id:string, id:string){
        return await this.prisma.manager.findUnique({
            where:{
                id,
                user_id
            }
        })
    }
}
