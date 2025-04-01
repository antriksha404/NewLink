import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import generateEnvFile from '../io/generateEnv';
import modifyAppModule from '../io/modifyAppModule';
import modifyMain from '../io/modifyMain';
import promptSelection from '../prompt/promptSelection';
import ServiceModules from '../serviceModule';
import logger from '../utils/logger';
import shellCommand, { changeDirectory } from '../utils/shell';

const Monolithic = async (projectName: string) => {
	try {
		const projectPath: string = path.resolve(process.cwd(), projectName);
		if (fs.existsSync(projectPath)) {
			logger.error(`Error: Directory '${projectName}' already exists. Please choose a different project name.`);
			process.exit(1);
		}
		const selectedModules = await promptSelection();
		logger('=================================================================');
		logger.info(`\nCreating NestJS project: ${projectName}...`);
		await shellCommand(`npx @nestjs/cli new ${projectName} --package-manager npm`);
		logger.success('NestJS project created successfully.');
		logger('=================================================================');

		const modules = selectedModules.map((moduleName) => ServiceModules.find((mod) => mod.name === moduleName)).filter((module) => module !== undefined);

		changeDirectory(projectPath);
		for (const module of modules) {
			logger.info(`Installing ${module.packageName}...`);
			shellCommand(`npm install ${module.packageName}`);
			logger.success(`✅ ${module.packageName} Installed.\n`);

			if (module.database) {
				shellCommand('npm install pg --save');
			}
		}

		await modifyAppModule(projectPath, modules);

		await modifyMain(projectPath, projectName);

		const envVars = modules.reduce<Record<string, string>>(
			(acc, mod) => ({
				...acc,
				...(mod.envVars || {}),
			}),
			{},
		);
		await generateEnvFile(projectPath, envVars);
		logger.success(`\n✅ Newput-newlink project '${projectName}' created successfully!`);
		logger('=================================================================');
	} catch (error) {
		console.error(chalk.red('Critical Error:'), error);
		process.exit(1);
	}
};
export default Monolithic;
