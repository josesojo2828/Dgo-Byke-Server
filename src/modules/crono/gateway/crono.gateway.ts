import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { CronoService } from '../service/crono.service';
import { CaptureEventDto } from '../dto/capture-event.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // Ajustar según tu entorno
  },
  namespace: 'crono', // Separa el tráfico de cronometraje de otros posibles sockets
})
export class CronoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('CronoGateway');

  constructor(private readonly cronoService: CronoService) { }

  afterInit(server: Server) {
    this.logger.log('Crono Gateway Inicializado');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // --- Mensajes ---

  @SubscribeMessage('joinRace')
  handleJoinRace(
    @ConnectedSocket() client: Socket,
    @MessageBody('raceId') raceId: string
  ) {
    client.join(`race_${raceId}`);
    this.logger.log(`Cliente ${client.id} se unió a la carrera: ${raceId}`);
  }

  // Método de apoyo para emitir desde servicios/usecases
  sendLeaderboardUpdate(raceId: string, data: any) {
    this.server.to(`race_${raceId}`).emit('leaderboardUpdate', data);
  }
}
