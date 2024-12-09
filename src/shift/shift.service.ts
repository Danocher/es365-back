import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShiftService {
    constructor(private prisma:PrismaService){}
    async getShifts(user_id:string){
        return await this.prisma.shift.findMany({
            where:{
                user_id
            },
            include:{
                order:true
            }
        })
    }
    async open(manager: string, user_id:string){
        const shift = await this.prisma.shift.findMany({
            where:{
                manager_id:manager,
                user_id,
                date_end:null
            }
        })
        if(shift.length>0){
            throw new BadRequestException('У вас есть неоконченная смена')
        }
        else{
            return await this.prisma.shift.create({
                data:{
                    manager_id:manager,
                    user_id,
                }
        })}
    }
    async close(id:string, user_id:string, res: Response){
        const shift =  await this.prisma.shift.update({
            where:{
                id,
                user_id
            },
            data:{
                date_end: new Date()
            }
        })
        
        
        return {shift:shift, time: subtractDates(shift.date_end,shift.date_start)}
    }
    async isOpen(id:string, user_id:string){
        const shift = await this.prisma.shift.findUnique({
            where:{
                id,
                user_id,
                date_end: null
            }
        })
       if(shift){
        return true
       }
       else{
        return false
       }
    }
}
function subtractDates(date1, date2) {
    // Преобразование обеих дат в миллисекунды
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    // Преобразование миллисекунд в удобные единицы измерения
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// // Пример использования
// const date1 = new Date("2023-09-01T12:00:00Z"); // 1 сентября 2023 года, 12:00 UTC
// const date2 = new Date("2023-08-25T15:30:00Z"); // 25 августа 2023 года, 15:30 UTC

// const difference = subtractDates(date1, date2);
// console.log(difference); // Выведет: "7d 20h 30m 0s"