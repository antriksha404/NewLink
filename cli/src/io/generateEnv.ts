import fs from 'fs-extra';
import path from 'path';
import logger from '../utils/logger';

const generateEnvFile = async (projectPath: string, envVars: Record<string, string>) => {
	if (!envVars || Object.keys(envVars).length === 0) return;
	logger.info(`Generating .env file...`);
	const envPath = path.join(projectPath, '.env');
	const content = Object.entries(envVars)
		.map(([key, val]) => `${key}=${val}`)
		.join('\n');
	await fs.writeFile(envPath, content, 'utf-8');
	logger.success('✅ .env file generated successfully.\n');
};

export default generateEnvFile;
