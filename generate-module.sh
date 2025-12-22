#!/bin/bash

# Validar que se ingresó un nombre
if [ -z "$1" ]; then
  echo "❌ Error: Debes ingresar el nombre del módulo."
  echo "Uso: ./generate-module.sh <nombre-en-singular>"
  echo "Ejemplo: ./generate-module.sh bicycle"
  exit 1
fi

# Variables de Nombres
NAME=$1
# Convertir a minúsculas (ej: bicycle)
LOWER_NAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')
# Capitalizar primera letra (ej: Bicycle)
CAP_NAME=$(echo "${LOWER_NAME:0:1}" | tr '[:lower:]' '[:upper:]')${LOWER_NAME:1}
# Directorio Base
BASE_DIR="src/modules/$LOWER_NAME"

echo "🚀 Creando módulo: $CAP_NAME en $BASE_DIR..."

# 1. Crear Estructura de Carpetas
mkdir -p "$BASE_DIR/controller"
mkdir -p "$BASE_DIR/repository"
mkdir -p "$BASE_DIR/service"
mkdir -p "$BASE_DIR/usecase"
mkdir -p "$BASE_DIR/interface"

# 2. Crear Interfaces (DTOs)
echo "📄 Generando Interfaces y DTOs..."
cat > "$BASE_DIR/interface/${LOWER_NAME}.dto.ts" <<EOF
export class Create${CAP_NAME}Dto {
  // Definir propiedades
}

export class Update${CAP_NAME}Dto {
  // Definir propiedades opcionales
}
EOF

# 3. Crear Repository (Prisma Wrapper)
echo "🗄️ Generando Repository..."
cat > "$BASE_DIR/repository/${LOWER_NAME}.repository.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/service/prisma.service';
import { Create${CAP_NAME}Dto, Update${CAP_NAME}Dto } from '../interface/${LOWER_NAME}.dto';

@Injectable()
export class ${CAP_NAME}Repository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Create${CAP_NAME}Dto) {
    // Ajustar 'modelName' al nombre real en tu schema.prisma
    // return this.prisma.modelName.create({ data });
    return 'create action in DB';
  }

  async findAll() {
    // return this.prisma.modelName.findMany();
    return 'findAll action in DB';
  }

  async findOne(id: string) {
    // return this.prisma.modelName.findUnique({ where: { id } });
    return 'findOne action in DB';
  }

  async update(id: string, data: Update${CAP_NAME}Dto) {
    // return this.prisma.modelName.update({ where: { id }, data });
    return 'update action in DB';
  }

  async remove(id: string) {
    // return this.prisma.modelName.update({ where: { id }, data: { deletedAt: new Date() } });
    return 'remove action in DB';
  }
}
EOF

# 4. Crear UseCase (Lógica Específica/Simple)
echo "⚙️ Generando UseCase..."
cat > "$BASE_DIR/usecase/${LOWER_NAME}.usecase.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { ${CAP_NAME}Repository } from '../repository/${LOWER_NAME}.repository';

@Injectable()
export class ${CAP_NAME}UseCase {
  constructor(private readonly repository: ${CAP_NAME}Repository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
EOF

# 5. Crear Service (Orquestador Principal)
echo "🧠 Generando Service..."
cat > "$BASE_DIR/service/${LOWER_NAME}.service.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { ${CAP_NAME}Repository } from '../repository/${LOWER_NAME}.repository';
import { Create${CAP_NAME}Dto, Update${CAP_NAME}Dto } from '../interface/${LOWER_NAME}.dto';

@Injectable()
export class ${CAP_NAME}Service {
  constructor(
    private readonly repository: ${CAP_NAME}Repository,
    // private readonly eventEmitter: EventEmitter2 // Si usas eventos
  ) {}

  async create(createDto: Create${CAP_NAME}Dto) {
    // 1. Validaciones extra
    // 2. Llamada al repository
    const result = await this.repository.create(createDto);
    // 3. Disparar evento (ej: 'bicycle.created')
    return result;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: Update${CAP_NAME}Dto) {
    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
EOF

# 6. Crear Controller
echo "🎮 Generando Controller..."
cat > "$BASE_DIR/controller/${LOWER_NAME}.controller.ts" <<EOF
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${CAP_NAME}Service } from '../service/${LOWER_NAME}.service';
import { Create${CAP_NAME}Dto, Update${CAP_NAME}Dto } from '../interface/${LOWER_NAME}.dto';

@Controller('${LOWER_NAME}s') // Pluralizado manualmente en la ruta
export class ${CAP_NAME}Controller {
  constructor(private readonly service: ${CAP_NAME}Service) {}

  @Post()
  create(@Body() createDto: Create${CAP_NAME}Dto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Update${CAP_NAME}Dto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
EOF

# 7. Crear Module
echo "📦 Generando Module..."
cat > "$BASE_DIR/${LOWER_NAME}.module.ts" <<EOF
import { Module } from '@nestjs/common';
import { ${CAP_NAME}Service } from './service/${LOWER_NAME}.service';
import { ${CAP_NAME}Controller } from './controller/${LOWER_NAME}.controller';
import { ${CAP_NAME}Repository } from './repository/${LOWER_NAME}.repository';
import { ${CAP_NAME}UseCase } from './usecase/${LOWER_NAME}.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [${CAP_NAME}Controller],
  providers: [
    ${CAP_NAME}Service,
    ${CAP_NAME}Repository,
    ${CAP_NAME}UseCase,
    PrismaService
  ],
  exports: [${CAP_NAME}Service]
})
export class ${CAP_NAME}Module {}
EOF

echo "✅ ¡Módulo $CAP_NAME creado exitosamente en $BASE_DIR!"
echo "⚠️  No olvides importar ${CAP_NAME}Module en tu app.module.ts"

## Entidades Principales
#./generate-module.sh bicycle
#./generate-module.sh user
#./generate-module.sh organization
#./generate-module.sh track
#./generate-module.sh category
#./generate-module.sh race
#
## Entidades Operativas
#./generate-module.sh participant   # Para RaceParticipant
#./generate-module.sh race-event    # Para RaceEvent (Live Tracking)
#./generate-module.sh audit-log     # Para AuditLog
