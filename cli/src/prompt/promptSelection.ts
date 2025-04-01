import inquirer from 'inquirer';
import ServiceModules from '../serviceModule';
import logger from '../utils/logger';
const DEFAULT_PROMPT = 'Module Selection :';
const PROJECT_CHOICES = ServiceModules.map((Module) => Module.name);

const promptSelection = async (prompt: string = DEFAULT_PROMPT, choices: string[] = PROJECT_CHOICES): Promise<string[]> => {
	try {
		const { promptSelection } = await inquirer.prompt([
			{
				name: 'promptSelection',
				type: 'checkbox',
				message: prompt,
				choices: choices,
			},
		]);
		return promptSelection;
	} catch (error) {
		logger.error(`Error in ${prompt}: ${error}`);
		process.exit(1);
	}
};

export default promptSelection;
