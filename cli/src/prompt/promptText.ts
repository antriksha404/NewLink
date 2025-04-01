import inquirer from 'inquirer';
import logger from '../utils/logger';

const DEFAULT_PROMPT = 'Enter your project name:';

const promptText = async (prompt: string = DEFAULT_PROMPT): Promise<string> => {
	try {
		const validNameRegex = /^[a-z0-9-_]+$/i;
		const { promptText } = await inquirer.prompt([
			{
				type: 'input',
				name: 'promptText',
				message: prompt,
				validate: (input: string) => {
					if (!input?.trim()) {
						return 'Input is required!';
					}
					if (!validNameRegex.test(input)) {
						return 'Input can only contain letters, numbers, hyphens, and underscores.';
					}
					return true;
				},
				filter: (input: string) => input.trim(),
			},
		]);
		if (!promptText || !validNameRegex.test(promptText)) {
			throw new Error('Invalid Input received');
		}

		return promptText;
	} catch (error) {
		logger.error(`Error in ${prompt}: ${error}`);
		process.exit(1);
	}
};

export default promptText;
