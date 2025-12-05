// src/core/errors/app.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseAppException extends HttpException {
    constructor(message: string, status: HttpStatus) {
        super(message, status);
    }
}

// src/core/errors/domain-errors.ts
export class EntityNotFoundException extends BaseAppException {
    constructor(entity: string) {
        super(`${entity} no encontrado/a`, HttpStatus.NOT_FOUND);
    }
}

export class DuplicateEntryException extends BaseAppException {
    constructor(message = 'El registro ya existe') {
        super(message, HttpStatus.CONFLICT);
    }
}

export class BusinessLogicException extends BaseAppException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}