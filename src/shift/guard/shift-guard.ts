// import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
// // import { PrismaService } from './prisma.service'; // Предполагая, что у вас есть PrismaService

// @Injectable()
// export class IsOpenGuard implements CanActivate {
//     constructor(private readonly prisma: PrismaService) {} // Инъекция сервиса Prisma

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest<Request>();
//         const user_id = request.headers.get('Authorization');
//         // const id = params.id as string; // Извлекаем id из параметров маршрута
//         // const user_id = params.user_id as string; // Извлекаем user_id из параметров маршрута

//         const shift = await this.prisma.shift.findUnique({
//             where: {
//                 id,
//                 user_id,
//                 date_end: null,
//             },
//         });

//         if (shift) {
//             return true;
//         } else {
//             throw new BadRequestException('Смена закрыта или не найдена');
//         }
//     }
// }