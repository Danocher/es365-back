import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma:PrismaService){}
    async getProducts(id:string){
        return this.prisma.product.findMany({
            where:{
                user_id: id
            }
        });
    }
    async deleteProduct(id:string, user_id:string){
        return this.prisma.product.delete({
            where:{
                id,
                user_id
            }
        })
    }
    async createProduct(name:string, buy:number, sell:number,user_id:string, date:Date, ){
        return this.prisma.product.create({
            data:{
                name,
                buy:buy,
                sell:sell,
                buy_date: date,
                user_id
            }
        })
    }
    async updateProduct(name:string, buy:number, sell:number,user_id:string, date:Date, id:string, ){
        return this.prisma.product.update({
            where:{
                id,
                user_id
            },
            data:{
                name,
                buy:buy,
                sell:sell,
                buy_date: date,
            }
        })
    }
}
