import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClientService {
    constructor(private prismaService: PrismaService){}
    async getClients(id:string){
        return await this.prismaService.client.findMany({
            where:{
                user_id: id
            }
        })
    }
    async createClient(fullname:string, phonenum:number, id:string){
        return await this.prismaService.client.create({
            data:{
                fullname,
                phonenum,
                user_id:id
            }
        })
    }
    async getOneClient(id:string, user_id:string){
        return await this.prismaService.client.findUnique({
            where:{
                id:id,
                user_id:user_id
            }
        })
    }
}
