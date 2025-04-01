import fs from 'fs-extra';
import path from 'path';
import generateDockerCompose from '../io/generateDockerCompose';
import generateDockerfile from '../io/generateDockerfile';
import generateEnvFile from '../io/generateEnv';
import modifyAppModule from '../io/modifyAppModule';
import modifyMain from '../io/modifyMain';
import promptSelection from '../prompt/promptSelection';
import ServiceModules from '../serviceModule';
import logger from '../utils/logger';
import shellCommand, { changeDirectory, makeDirectory } from '../utils/shell';

const Microservice = async (projectName: string) => {
	try {
		const projectPath: string = path.resolve(process.cwd(), projectName);

		if (fs.existsSync(projectPath)) {
			logger.error(`Error: Directory '${projectName}' already exists. Please choose a different project name.`);
			process.exit(1);
		}
		makeDirectory(projectPath);
		changeDirectory(projectPath);

		const selectedModules = await promptSelection();
		logger('=================================================================');
		logger.info(`Setting up Microservices.`);

		const modules = selectedModules.map((moduleName) => ServiceModules.find((mod) => mod.name === moduleName)).filter((module) => module !== undefined);

		for (const module of modules) {
			if (!module) {
				logger.error(`Module not found in ServiceModules.`);
				process.exit(1);
			}
			const serviceName = `${module.name}-service`;
			const servicePath = path.join(projectPath, serviceName);

			logger('=================================================================');
			logger.success(module.name);
			logger('=================================================================');

			logger.info(`\nCreating microservice for ${module.name}...`);
			await shellCommand(`npx @nestjs/cli new ${serviceName} --package-manager npm`);
			logger.success(`✅ Microservice for ${module.name} created successfully.\n`);

			changeDirectory(servicePath);

			logger.info(`Installing ${module.packageName}...`);
			shellCommand(`npm install ${module.packageName}`);
			logger.success(`✅ ${module.packageName} Installed.\n`);

			if (module.database) {
				shellCommand('npm install pg --save');
			}

			// Modify app.module
			await modifyAppModule(servicePath, [module]);

			// modifyMain
			await modifyMain(servicePath, serviceName);

			// ENV
			const envVars = { ...(module.envVars || {}) };

			// Example tweak for DB hostname in Docker
			if (module.database) envVars.DB_HOST = 'database';
			await generateEnvFile(servicePath, envVars);

			// Dockerfile
			await generateDockerfile(servicePath, serviceName);

			logger.info(`Installing dependencies...`);
			try {
				shellCommand('npm install', true);
				logger.success(`✅ Dependencies installed.\n`);
			} catch {
				logger.warning(`npm install encountered errors. Please review manually.`);
			}
			changeDirectory(projectPath);
		}

		logger('=================================================================');
		await generateDockerCompose(projectPath, modules);
		logger('=================================================================');

		changeDirectory(projectPath);

		logger.success('✅ Microservices setup completed successfully!');
		logger.success(`Navigate to '${projectName}' and explore your microservices in project directory.`);
		logger('=================================================================');
	} catch (error) {
		logger.error(`Critical Error: ${error}`);
		process.exit(1);
	}
};
export default Microservice;
