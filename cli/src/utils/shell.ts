import shell from 'shelljs';

/**
 * Executes a shell command and returns its output.
 *
 * @param cmd - The shell command to execute
 * @param silent - Whether to hide the command output (defaults to true)
 * @returns A promise that resolves with the command's standard output
 * @throws Error if the command fails (non-zero exit code)
 */
const shellCommand = async (cmd: string, silent = true): Promise<string> => {
	return new Promise((resolve, reject) => {
		shell.exec(cmd, { silent }, (code, stdout, stderr) => {
			if (code !== 0) {
				reject(new Error(`Failed to run command: ${cmd}\n${stderr}`));
			}
			resolve(stdout);
		});
	});
};

/**
 * Changes the current working directory.
 *
 * @param directory - The path to change the working directory to
 * @throws Error if changing directory fails
 */
export const changeDirectory = (directory: string): void => {
	shell.cd(directory);
	if (shell.error()) {
		throw new Error(`Failed to change directory to: ${directory}`);
	}
};

/**
 * Create directory.
 *
 * @param directory - The path to create the directory
 * @throws Error if directory creation fails
 */
export const makeDirectory = (directory: string): void => {
	shell.mkdir('-p', directory);
	if (shell.error()) {
		throw new Error(`Failed to create directory: ${directory}`);
	}
};

export default shellCommand;
