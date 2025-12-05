import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export function registerPartialsRecursive(
    directory: string,
    baseDir: string = directory, // Directorio base para crear nombres relativos
) {
    try {
        const filenames = fs.readdirSync(directory);

        filenames.forEach((filename) => {
            const filePath = path.join(directory, filename);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                registerPartialsRecursive(filePath, baseDir);
            } else if (filename.endsWith('.hbs')) {
                const template = fs.readFileSync(filePath, 'utf8');

                const relativePath = path.relative(baseDir, filePath);
                const partialName = relativePath
                    .replace(/\\/g, '/') // Normaliza slashes para Windows
                    .replace(/\.hbs$/, ''); // Quita la extensión

                handlebars.registerPartial(partialName, template);

            }
        });
    } catch (error) {
        console.error(`Error al registrar partials en ${directory}:`, error);
    }
}