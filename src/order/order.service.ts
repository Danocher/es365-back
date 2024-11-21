import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order-dto';

@Injectable()
export class OrderService {
    constructor(private prisma:PrismaService){}
    async getOrders(user_id:string){
        return await this.prisma.order.findMany({
            where:{
                user_id
            },
            include:{
                products:true
            }
        })
    }
    async getClientOrders(client:string, user_id:string){
        return await this.prisma.order.findMany({
            where:{
                user_id,
                client_id:client},
            include:{
                products:true
            }
        })
    }
    async getManagerOrders(manager:string, user_id:string){
        return await this.prisma.order.findMany({
            where:{
                user_id,
                manager_id:manager},
            include:{
                products:true
            }
        })
    }
    async createOrders(user_id:string, dto:OrderDto, shift:string){
        const manager = await this.prisma.shift.findUnique({
            where:{
                id:shift
            },
            select:{
                manager:true
            }
        })
        return await this.prisma.order.create({
            data:{
                client_id: dto.client_id,
                manager_id: manager.manager.id,
                shift_id: shift,
                user_id:user_id,
                sum:dto.sum,
                products: {
                    connect: dto.products
                }
            },
            
        })
    }
}   
