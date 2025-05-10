// authentication.module.ts
import { DynamicModule, Global, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AuditOptionsType } from 'audit.type';
import { DatabaseOptionsType } from 'database.types';

import { DatabaseModule } from '@newput-newlink/database';
import { AuditService } from 'services/audit.service';

@Global()
@Module({})
export class AuditModule {
	static async register(config: AuditOptionsType, database: DatabaseOptionsType = {}): Promise<DynamicModule> {
		// Create a database module dynamically
		const databaseModule = DatabaseModule.register(database, []);

		const imports = [
			ConfigModule.forRoot({ isGlobal: true }),
			databaseModule,
		];

		// Base providers that are needed regardless of database type
		const providers = [
			{
				provide: 'ENALBE_DB_AUDIT',
				useValue: config.enable,
			},
      {
				provide: 'DISALBE_DB_AUDIT',
				useValue: config.disable,
			},
			{
				provide: APP_PIPE,
				useFactory: () => {
					return new ValidationPipe({
						whitelist: true,
						transform: true,
						forbidNonWhitelisted: true,
						transformOptions: {
							enableImplicitConversion: true,
						},
					});
				},
			},
			AuditService,
		];

		const controllers = [];
		const exports = [AuditService];

		return {
			module: AuditModule,
			imports: imports,
			providers: providers,
			controllers: controllers,
			exports: exports,
		};
	}
}
