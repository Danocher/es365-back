import { Injectable, CanActivate, ExecutionContext, BadRequestException, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Iuser } from 'src/types/types';

@Injectable()
export class IsOpenGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {} 

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const id = request.cookies['shift']
        const user_id = request.user.id
        

        const shift = await this.prisma.shift.findUnique({
            where: {
                id,
                user_id,
                date_end: null,
            },
        });
        if (shift) {
            return true;
        } else {
            throw new BadRequestException('Смена закрыта или не найдена');
        }
    }
}