import fs from 'fs/promises';
import path from 'path';
import ServiceModuleType from '../serviceModule.types';
import logger from '../utils/logger';

const generateDockerCompose = async (projectPath: string, modules: ServiceModuleType[]) => {
	logger.info(`Creating DockerCompose ...`);
	const composePath = path.join(projectPath, 'docker-compose.yml');
	let composeContent = `services:\n`;
	for (const module of modules) {
		const serviceName = `${module.name}-service`;
		composeContent += `  ${serviceName}:
		    build: ./${serviceName}
		    container_name: ${serviceName}
		    ports:
		      - "3${Math.floor(Math.random() * 900 + 100)}:3000"
		    env_file:
		      - ./${serviceName}/.env
		    depends_on:
		      - database
		`;
	}
	composeContent += `
		  database:
		    image: postgres
		    container_name: postgres
		    ports:
		      - "5432:5432"
		    environment:
		      - POSTGRES_USER=postgres
		      - POSTGRES_PASSWORD=postgres
		      - POSTGRES_DB=postgres
		    volumes:
		      - postgres-data:/var/lib/postgresql/data

		volumes:
		  postgres-data:
		`;
	await fs.writeFile(composePath, composeContent.trim(), 'utf-8');
	logger.success(`✅ DockerCompose created.`);
};
export default generateDockerCompose;
