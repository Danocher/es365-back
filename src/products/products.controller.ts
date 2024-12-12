import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Product } from '@prisma/client';
import { ProductDto, ProductUpdateDto } from './prosucts.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get('/get')
  @UseGuards(JwtAuthGuard)
  async getProducts(@Req() req) {
    return await this.productsService.getProducts(req.user.id);
  }
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Req() req, @Query('id') id: string) {
     await this.productsService.deleteProduct(id, req.user.id);
     return{success: "Продукт успешно удален"}
  }
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Req() req, @Body() dto:ProductDto) {
    return await this.productsService.createProduct(dto.name, Number(dto.buy), Number(dto.sell), req.user.id, dto.date);
  }
  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Req() req, @Body() dto:ProductUpdateDto) {
     await this.productsService.updateProduct(dto.name, Number(dto.buy), Number(dto.sell), req.user.id, dto.date , dto.id);
     return {success: "Продукт успешно обновлен"}
  }
}
