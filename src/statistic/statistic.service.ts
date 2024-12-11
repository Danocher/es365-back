import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Statistic0Dto } from './statistic0dto';

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
    async getMonthlyManagerSell(id:string){
        const data = await this.prisma.order.findMany({
            where: {
                user_id: id,
                date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            },
            select: {
                sum: true,
                manager: {
                    select: {
                        name: true
                    }
                }
            },
            
        })
        const res ={};  
        for (let i = 0; i < data.length; i++) {
            if (res[data[i].manager.name]) {
                res[data[i].manager.name] += data[i].sum;
            } else {
                res[data[i].manager.name] = data[i].sum;
            }
        }
        const sort = [];
        for (const key in res) {
            sort.push({ name: key, sell: res[key] });
        }
        return sort}
}
