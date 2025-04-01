import inquirer from 'inquirer';
import logger from '../utils/logger';

const DEFAULT_PROMPT = 'Choose Project Type:';
const PROJECT_CHOICES = ['Microservice', 'Monolithic'];
const DEFAULT_CHOICE = 'Microservice';

const promptChoices = async (prompt: string = DEFAULT_PROMPT, choices: string[] = PROJECT_CHOICES, defaultChoice: string = DEFAULT_CHOICE): Promise<string> => {
	try {
		const { promptChoices } = await inquirer.prompt([
			{
				name: 'promptChoices',
				type: 'list',
				message: `${prompt} (Default: ${defaultChoice})`,
				choices: choices,
				default: defaultChoice,
			},
		]);

		return promptChoices;
	} catch (error) {
		logger.error(`Error in ${prompt}: ${error}`);
		process.exit(1);
	}
};

export default promptChoices;
