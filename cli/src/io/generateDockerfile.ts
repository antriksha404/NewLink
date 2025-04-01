import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger';

const DOCKERFILE_CONTENT = `
FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]`;

const generateDockerfile = async (servicePath: string, serviceName: string) => {
	logger.info(`Creating Dockerfile for ${serviceName}...`);
	await fs.writeFile(path.join(servicePath, 'Dockerfile'), DOCKERFILE_CONTENT.trim(), 'utf-8');
	logger.success(`✅ Dockerfile created for ${serviceName}.\n`);
};

export default generateDockerfile;
