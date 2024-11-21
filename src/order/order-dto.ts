import { Product } from "@prisma/client";
export class OrderDto{
  manager_id:string; 
  client_id:string;
  products:Product[];
  shift_id:string;
  sum:number
}