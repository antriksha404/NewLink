import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { HederaService } from "hedera/services/hedera.service";
import { HederaController } from "hedera/controllers/hedera.controller";
import { BlockchainOptionsType } from "blockchain.type";
import { DefaultDTO } from "./dto";

function resolveConfigFromEnv(configService: ConfigService): BlockchainOptionsType {
  const options: BlockchainOptionsType = {
    blockchain: configService.get<string>('BLOCKCHAIN', 'hedera'),
    network: (configService.get<string>('BLOCKCHAIN_NETWORK', 'testnet') as BlockchainOptionsType['network']),
    account_id: configService.get<string>('BLOCKCHAIN_ACCOUNT_ID'),
    private_key: configService.get<string>('BLOCKCHAIN_PRIVATE_KEY'),
    initial_balance: Number(configService.get<number>('BLOCKCHAIN_INITIAL_BALANCE', 10_000_000)),
    dto: DefaultDTO,
  };

  if (!options.account_id || !options.private_key) {
    throw new Error('Blockchain account_id and private_key are required.');
  }
  if (!['mainnet', 'testnet', 'previewnet'].includes(options.network!)) {
    throw new Error('Invalid blockchain network. Supported networks: mainnet, testnet, previewnet.');
  }
  return options;
}

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [HederaController],
  providers: [
    
    {
      provide: 'BLOCKCHAIN_CONFIG',
      useFactory: (configService: ConfigService): BlockchainOptionsType => {
        return resolveConfigFromEnv(configService);
      },
      inject: [ConfigService],
    },

    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },

    ...DefaultDTO,
    HederaService,
  ],
  exports: [
    'BLOCKCHAIN_CONFIG',
    HederaService,
  ],
})
export class BlockchainModule {}

