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
        async getMonthlySelectedManagerSell(id:string, month: number){
            const startOfMonth = new Date(new Date().getFullYear(), month, 1);
            const endOfMonth = new Date(new Date().getFullYear(), month + 1, 0, 23, 59, 59, 999);
            const data = await this.prisma.order.findMany({
                where: {
                    user_id: id,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                },
                select: {
                    sum: true,
                    manager: {
                        select: {
                            name: true
                        }
                    },
                    
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
            async getManagerStatsByDateRange1(id: string, startDate: Date, endDate: Date) {
                const orders = await this.prisma.order.groupBy({
                    by: ['manager_id', 'date'],
                    where: {
                        user_id: id,
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    _sum: {
                        sum: true
                    },
                    orderBy: {
                        date: 'asc'
                    }
                });
            
                // Получаем информацию о менеджерах
                const managerIds = [...new Set(orders.map(order => order.manager_id))];
                const managers = await this.prisma.manager.findMany({
                    where: {
                        id: {
                            in: managerIds
                        }
                    },
                    select: {
                        id: true,
                        name: true
                    }
                });
            
                // Создаем мапу менеджеров для быстрого доступа
                const managersMap = new Map(managers.map(m => [m.id, m.name]));
            
                // Форматируем результат
                return orders.map(order => ({
                    date: order.date,
                    manager_name: managersMap.get(order.manager_id),
                    // manager_id: order.manager_id,
                    daily_sales: order._sum.sum
                }))}
                async getManagerStatsByDateRange(id: string, startDate: Date, endDate: Date) {
                    const orders = await this.prisma.order.groupBy({
                        by: ['manager_id', 'date'],
                        where: {
                            user_id: id,
                            date: {
                                gte: startDate,
                                lte: endDate
                            }
                        },
                        _sum: {
                            sum: true
                        },
                        orderBy: {
                            date: 'asc'
                        }
                    });
                
                    const managerIds = [...new Set(orders.map(order => order.manager_id))];
                    const managers = await this.prisma.manager.findMany({
                        where: {
                            id: {
                                in: managerIds
                            }
                        },
                        select: {
                            id: true,
                            name: true
                        }
                    });
                
                    const managersMap = new Map(managers.map(m => [m.id, m.name]));
                
                    // Group orders by date
                    const groupedByDate = orders.reduce((acc, order) => {
                        const dateStr = order.date.toLocaleDateString('ru-RU');
                        if (!acc[dateStr]) {
                            acc[dateStr] = [];
                        }
                        acc[dateStr].push({
                            manager_name: managersMap.get(order.manager_id),
                            day_sel: order._sum.sum
                        });
                        return acc;
                    }, {});

                    // Transform to final format
                    return Object.entries(groupedByDate).map(([dateStr, data]) => ({
                        date: dateStr,
                        data: data
                    }));
                }
}

