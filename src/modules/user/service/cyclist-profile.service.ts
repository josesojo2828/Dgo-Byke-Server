import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateCyclistProfileDto } from '../interface/ciclist.dto';

@Injectable()
export class CyclistProfileService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crea o actualiza el perfil.
     * Usamos upsert para manejar la lógica de "Crear si no existe, actualizar si existe"
     * lo cual es ideal para perfiles de usuario 1 a 1.
     */
    async createOrUpdate(userId: string, dto: CreateCyclistProfileDto) {
        // Usamos 'extended' si implementaste mi respuesta anterior, 
        // sino usa 'this.prisma.cyclistProfile'
        return this.prisma.cyclistProfile.upsert({
            where: { userId },
            create: {
                userId,
                ...dto,
            },
            update: {
                ...dto,
                deletedAt: null, // Si estaba soft-deleted, lo revivimos al editar
            },
        });
    }

    /**
     * Obtener el perfil de un usuario específico
     */
    async findOneByUserId(userId: string) {
        const profile = await this.prisma.cyclistProfile.findUnique({
            where: { userId },
            include: {
                bicycles: true, // Opcional: traer sus bicis de una vez
            },
        });

        // Nota: findUnique en mi implementación anterior lo convertimos a findFirst 
        // internamente para soportar softDelete, así que esto respeta deletedAt: null
        return profile;
    }

    /**
     * Soft Delete del perfil
     */
    async remove(userId: string) {
        // Primero buscamos el ID del perfil basado en el userId
        const profile = await this.prisma.cyclistProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            throw new NotFoundException('Perfil no encontrado');
        }

        // Ejecutamos el delete (que tu PrismaService convierte en update deletedAt)
        return this.prisma.cyclistProfile.delete({
            where: { id: profile.id },
        });
    }
}