import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatisticService {
    constructor(private prisma:PrismaService){}
    async getTotalMonthSell(id:string){
        return await this.prisma.order.aggregate({
            where: {
                user_id: id,
                date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            },
            _sum: {
                sum: true
            }
        })}
    async getActiveManagers(id:string){
        return await this.prisma.shift.aggregate({
            where:{
                user_id:id,
                date_end: null

            },
            _count: {
                manager_id: true
        }})
    }   
    async getProductCount(id:string){
        return await this.prisma.product.aggregate({
            where:{
                user_id:id
            },
            _count: {
                id: true
            }
        })
    }
}
