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
}
