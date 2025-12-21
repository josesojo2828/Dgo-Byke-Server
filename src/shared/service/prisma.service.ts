import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private _extendedClient: any;

  constructor() {
    super();
  }

  get x() {
    if (!this._extendedClient) {
      this._extendedClient = this.$extends({
        query: {
          $allModels: {
            async delete({ model, args }) {
              return (this as any)[model].update({
                ...args,
                data: { deletedAt: new Date() },
              });
            },
            async deleteMany({ model, args }) {
              return (this as any)[model].updateMany({
                ...args,
                data: { deletedAt: new Date() },
              });
            },
          },
        },
      });
    }
    return this._extendedClient;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}