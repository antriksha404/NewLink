import ServiceModuleType from './serviceModule.types';
const ServiceModules: ServiceModuleType[] = [
	{
		name: 'authentication',
		packageName: '@newput-newlink/authentication',
		importStatement: `import { AuthenticationModule } from '@newput-newlink/authentication';`,
		moduleRegistration: `AuthenticationModule.register(
          {
            authenticationField: 'phone',
          },
          {
            synchronize: true,
          }
        )`,
		envVars: {
			JWT_SECRET: 'your_jwt_secret',
			JWT_EXPIRATION: '1d',
			DB_TYPE: 'postgres',
			DB_HOST: 'localhost',
			DB_PORT: '5432',
			DB_USERNAME: 'postgres',
			DB_PASSWORD: 'postgres',
			DB_NAME: 'postgres',
			DB_SYNCHRONIZE: 'true',
		},
		database: true,
	},
	{
		name: 'blockchain',
		packageName: '@newput-newlink/blockchain',
		importStatement: `import { BlockchainModule } from '@newput-newlink/blockchain';`,
		moduleRegistration: `BlockchainModule.register({})`,
		envVars: {
			BLOCKCHAIN: 'hedera',
			BLOCKCHAIN_NETWORK: 'testnet',
			BLOCKCHAIN_ACCOUNT_ID: '0.0.12345',
			BLOCKCHAIN_PRIVATE_KEY: 'your_private_key',
		},
	},
	{
		name: 'notification',
		packageName: '@newput-newlink/notification',
		importStatement: `import { NotificationModule } from '@newput-newlink/notification';`,
		moduleRegistration: `NotificationModule.register({})`,
		envVars: {
			EMAIL_HOST: 'smtp.mailtrap.io',
			EMAIL_PORT: '587',
			EMAIL_USER: 'your_email',
			EMAIL_PASS: 'your_password',
			EMAIL_FROM: 'your_email',
			PLIVO_AUTH_ID: 'plivo_auth_id',
			PLIVO_AUTH_TOKEN: 'plivo_auth_token',
			PLIVO_FROM_NUMBER: 'plivo_from_number',
		},
	},
];

export default ServiceModules;
