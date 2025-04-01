#!/usr/bin/env node
import promptChoices from './prompt/promptChoice';
import promptText from './prompt/promptText';
import Microservice from './templates/microservice';
import Monolithic from './templates/monolithic';
import logger from './utils/logger';

// ------------------------ MAIN ------------------------

async function main() {
	logger.success('Welcome to the Newput-Newlink CLI!', true, true);
	logger('=================================================================');
	const projectName = await promptText();
	logger('=================================================================');
	const projectType = await promptChoices();
	logger('=================================================================');

	if (projectType === 'Monolithic') {
		await Monolithic(projectName);
	} else {
		await Microservice(projectName);
	}
}
main().catch((error) => {
	logger.error(`Unhandled Error: ${error}`);
	process.exit(0);
});
