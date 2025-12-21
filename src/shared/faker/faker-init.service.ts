import { Injectable } from "@nestjs/common";

// Servicios y Repositorios
import { LoggerService } from "../logger/logger.service";

interface FakerConfig {
    userCount: number;
    paymentsByUser: number;
    historyCount: number; // Cantidad de suscripciones pasadas
}

@Injectable()
export class FakerInitService {

    constructor(
        private readonly logger: LoggerService,
    ) { }

    public async pipeline(config: FakerConfig) {
        this.logger.logInfo(`Iniciando Faker Pipeline: ${config.userCount} usuarios`);

    }
}