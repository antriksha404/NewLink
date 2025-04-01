import fs from 'fs-extra';
import path from 'path';

import logger from '../utils/logger';
import shellCommand from '../utils/shell';

const modifyMain = async (projectPath: string, projectName: string) => {
	const IMPORT_SNIPPET = `import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';`;
	const SWAGGER_SNIPPET = `
		const config = new DocumentBuilder()
			.setTitle('${projectName} API Doc')
			.setDescription('The ${projectName} API description')
			.setVersion('1.0')
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('', app, document);`;
	const CORS_SNIPPET = `
		app.enableCors({
			origin: '*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			credentials: true,
		});
		`;

	logger.info(`Implementing Changes to main.ts...`);

	const mainPath = path.join(projectPath, 'src', 'main.ts');
	if (!fs.existsSync(mainPath)) {
		logger.error(`main.ts not found at: ${mainPath}`);
		process.exit(1);
	}

	shellCommand(`npm install @nestjs/swagger`);

	let mainContent = await fs.readFile(mainPath, 'utf-8');
	mainContent = mainContent.replace(`import { AppModule } from './app.module';`, `import { AppModule } from './app.module';\n${IMPORT_SNIPPET}`);
	mainContent = mainContent.replace(`const app = await NestFactory.create(AppModule);`, `const app = await NestFactory.create(AppModule);\n${SWAGGER_SNIPPET}\n${CORS_SNIPPET}`);
	await fs.writeFile(mainPath, mainContent, 'utf-8');

	logger.success('✅ main.ts modified successfully.\n');
};

export default modifyMain;
