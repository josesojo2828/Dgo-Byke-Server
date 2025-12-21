/**
 * Files Module
 * Responsabilidad: Gestionar la subida, almacenamiento y recuperación de archivos (Imágenes, Documentos).
 * Ej. Subir la foto de perfil del usuario o el logo de un club.
 */
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule { }
