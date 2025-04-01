import fs from 'fs-extra';
import path from 'path';

import ServiceModuleType from '../serviceModule.types';
import logger from '../utils/logger';

async function modifyAppModule(projectPath: string, selectedModules: ServiceModuleType[]) {
	logger.info(`Implementing Changes to AppModule...`);

	const appModulePath = path.join(projectPath, 'src', 'app.module.ts');

	if (!fs.existsSync(appModulePath)) {
		logger.error(`app.module.ts not found at: ${appModulePath}`);
		process.exit(1);
	}

	let appModuleContent = await fs.readFile(appModulePath, 'utf-8');

	const imports = selectedModules.map((m) => m.importStatement);
	const registrations = selectedModules.map((m) => m.moduleRegistration);

	// Insert ConfigModule at top of module list
	imports.unshift(`import { ConfigModule } from '@nestjs/config';`);
	registrations.unshift(`ConfigModule.forRoot({ isGlobal: true })`);

	appModuleContent = appModuleContent.replace(`import { AppService } from './app.service';`, `import { AppService } from './app.service';\n${imports.join('\n')}`);
	appModuleContent = appModuleContent.replace('imports: []', `imports: [\n${registrations.join(',\n')}\n]`);

	await fs.writeFile(appModulePath, appModuleContent, 'utf-8');

	logger.success('✅ AppModule modified successfully.\n');
}

export default modifyAppModule;
