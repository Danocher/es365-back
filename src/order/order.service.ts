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
                manager:true,
                client:true,
                products:true
            }
        })
    }
    async getOrdersById(order_id:string, user_id:string){
        return await this.prisma.order.findUnique({
            where:{
                id:order_id,
                user_id
            },
            include:{
                manager:true,
                client:true,
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
    async findOrderByInterval(user_id:string, start:Date, end:Date){
        return await this.prisma.order.findMany({
            where:{
                user_id,
                date:{
                    gte: start,
                    lte: end
                }
            },
            include:{
                products:true
            }
        })
    }
    async findManagerOrdersByInterval(user_id:string, start:Date, end:Date, manager_id:string){
        return await this.prisma.order.findMany({
            where:{
                user_id,
                manager_id,
                date:{
                    gte: start,
                    lte: end
                }
            },
            include:{
                products:true
            }
        })
    }
    async findClientOrdersByInterval(user_id:string, start:Date, end:Date, client_id:string){
        return await this.prisma.order.findMany({
            where:{
                user_id,
                client_id,
                date:{
                    gte: start,
                    lte: end
                }
            },
            include:{
                products:true
            }
        })
    }
    async findMonthlySell(user_id:string){
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return await this.prisma.order.findMany({
            where:{
                user_id,
                date:{
                    gte: startOfMonth,
                    lte: endOfMonth
                }    
            },
            include:{
                products:true
            }
        })
    }
    async findMonthlyProfit(user_id:string){
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const orders  = await this.prisma.order.findMany({
            where:{
                user_id,
                date:{
                    gte: startOfMonth,
                    lte: endOfMonth
                }    
            },
            include:{
                products:true
            }
        })
        let profit = 0
        for(let i =0;i<orders.length;i++){
            for(let k=0;k<orders[i].products.length;k++){
                profit += orders[i].products[k].sell - orders[i].products[k].buy
            }
        }
        return profit
    }
}   
