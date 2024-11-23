import { Product } from "@prisma/client";
export class OrderDto{
  client_id:string;
  products:Product[];
  sum:number
}