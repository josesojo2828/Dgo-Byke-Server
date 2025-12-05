// en src/shared/multer-config/multer-config.module.ts

import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './public/files', // Asegúrate que esta ruta sea correcta desde la raíz
        filename: (req, file, cb) => {
          const now = new Date();
          const pad = (num: number) => num.toString().padStart(2, '0');

          const year = now.getFullYear();
          const month = pad(now.getMonth() + 1);
          const day = pad(now.getDate());
          const hours = pad(now.getHours());
          const minutes = pad(now.getMinutes());
          const seconds = pad(now.getSeconds());

          const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
          const safeOriginalName = file.originalname.replace(/\s+/g, '_');
          const newFilename = `${timestamp}_${safeOriginalName}`;

          return cb(null, newFilename);
        },
      }),
    }),
  ],
  exports: [MulterModule], // <-- 2. Exporta el módulo configurado para que otros lo usen
})
export class MulterConfigModule {}