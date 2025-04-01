import chalk, { ChalkInstance } from 'chalk';

/**
 * Enhanced logger utility with method-based interface
 */
interface Logger {
	(message: string, bold?: boolean, underline?: boolean): void;
	success(message: string, bold?: boolean, underline?: boolean): void;
	warning(message: string, bold?: boolean, underline?: boolean): void;
	info(message: string, bold?: boolean, underline?: boolean): void;
	error(message: string, bold?: boolean, underline?: boolean): void;
}

/**
 * Apply formatting based on options
 */
const applyFormatting = (style: ChalkInstance, bold: boolean = false, underline: boolean = false): ChalkInstance => {
	let formattedStyle = style;
	if (bold) formattedStyle = formattedStyle.bold;
	if (underline) formattedStyle = formattedStyle.underline;
	return formattedStyle;
};

/**
 * Creates a logger with method-based interface
 */
const createLogger = (): Logger => {
	// Base logger function (default)
	const logger = (message: string, bold: boolean = false, underline: boolean = false): void => {
		const style = applyFormatting(chalk.white, bold, underline);
		console.log(style(message));
	};

	// Add methods to the base function
	logger.success = (message: string, bold: boolean = false, underline: boolean = false): void => {
		const style = applyFormatting(chalk.green, bold, underline);
		console.log(style(message));
	};

	logger.warning = (message: string, bold: boolean = false, underline: boolean = false): void => {
		const style = applyFormatting(chalk.yellow, bold, underline);
		console.log(style(message));
	};

	logger.info = (message: string, bold: boolean = false, underline: boolean = false): void => {
		const style = applyFormatting(chalk.blue, bold, underline);
		console.log(style(message));
	};

	logger.error = (message: string, bold: boolean = false, underline: boolean = false): void => {
		const style = applyFormatting(chalk.red, bold, underline);
		console.log(style(message));
	};

	return logger;
};

// Create and export the logger instance
const logger = createLogger();
export default logger;
