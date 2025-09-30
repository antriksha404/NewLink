#!/usr/bin/env node

import { checkbox, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES = [
	{
		name: 'Authentication',
		value: 'authentication',
		subOptions: [
			{
				name: 'PostgreSQL',
				value: 'postgres',
				path: 'services/authentication/postgres/',
			},
			{
				name: 'MongoDB',
				value: 'mongodb',
				path: 'services/authentication/mongodb/',
			},
		],
	},
	{
		name: 'Blockchain',
		value: 'blockchain',
		path: 'services/blockchain/',
	},
	{
		name: 'Notification',
		value: 'notification',
		path: 'services/notification/',
	},
];

let appName = '';
let selectedServices = [];
const CLI_ROOT = __dirname; // CLI package root directory

// Get app name
async function getAppName() {
	appName = await input({
		message: chalk.cyan('What is the name of the app?'),
		validate: (value) => {
			if (!value) return 'App name is required';
			if (!/^[a-z0-9-_]+$/i.test(value)) return 'Only alphanumeric, hyphens, and underscores allowed';
			if (fs.existsSync(value)) return `Directory "${value}" already exists`;
			return true;
		},
	});

	console.log(chalk.green(`\n✓ App Name: ${appName}\n`));
}

// Display and select services
async function selectServices() {
	const choices = SERVICES.map((service) => ({
		name: service.name,
		value: service.value,
	}));

	const selected = await checkbox({
		message: chalk.cyan('Select services (use space to select, enter to confirm)'),
		choices,
		validate: (answer) => {
			if (answer.length === 0) return 'You must choose at least one service';
			return true;
		},
	});

	for (const serviceValue of selected) {
		const service = SERVICES.find((s) => s.value === serviceValue);

		if (service.subOptions) {
			// Ask for sub-option (database type for authentication)
			console.log(chalk.yellow(`\n${service.name} requires additional configuration:`));

			const subChoice = await select({
				message: chalk.cyan(`Select database for ${service.name}`),
				choices: service.subOptions.map((opt) => ({
					name: opt.name,
					value: opt.value,
				})),
			});

			const selectedSubOption = service.subOptions.find((opt) => opt.value === subChoice);

			selectedServices.push({
				name: service.value,
				displayName: service.name,
				path: selectedSubOption.path,
				dbType: selectedSubOption.value,
			});

			console.log(chalk.green(`✓ Selected: ${service.name} with ${selectedSubOption.name}`));
		} else {
			selectedServices.push({
				name: service.value,
				displayName: service.name,
				path: service.path,
			});

			console.log(chalk.green(`✓ Selected: ${service.name}`));
		}
	}

	console.log(chalk.bold.cyan('\n📋 Summary of selected services:'));
	selectedServices.forEach((s) => {
		console.log(chalk.white(`  • ${s.displayName}${s.dbType ? chalk.gray(` (${s.dbType})`) : ''}`));
	});
}

// Create project structure
async function createProjectStructure() {
	console.log(chalk.bold.cyan('\n🚀 Creating project structure...\n'));

	// Create main app directory
	if (!fs.existsSync(appName)) {
		fs.mkdirSync(appName);
	}

	const servicesDir = path.join(appName, 'services');
	if (!fs.existsSync(servicesDir)) {
		fs.mkdirSync(servicesDir);
	}

	// Copy selected services
	for (const service of selectedServices) {
		const destPath = path.join(servicesDir, service.name);

		// Build source path from CLI package root (__dirname)
		const sourcePath = path.join(CLI_ROOT, service.path);

		console.log(chalk.blue(`📦 Copying ${service.displayName} service...`));

		if (fs.existsSync(sourcePath)) {
			copyDirectory(sourcePath, destPath);
			console.log(chalk.green(`✓ ${service.displayName} copied successfully from ${service.path}`));
		} else {
			// Create placeholder if source doesn't exist
			console.log(chalk.yellow(`⚠ Source not found at ${sourcePath}`));
			console.log(chalk.yellow(`  Creating placeholder for ${service.displayName}`));
			fs.mkdirSync(destPath, { recursive: true });
			fs.writeFileSync(
				path.join(destPath, 'package.json'),
				JSON.stringify(
					{
						name: `@${appName}/${service.name}`,
						version: '1.0.0',
						main: 'index.js',
					},
					null,
					2,
				),
			);
			console.log(chalk.gray(`  → ${destPath}`));
		}
	}
}

// Copy directory recursively
function copyDirectory(src, dest) {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const entries = fs.readdirSync(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			copyDirectory(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

// Initialize npm with workspaces
async function initializeNpm() {
	console.log(chalk.bold.cyan('\n📦 Initializing npm with workspaces...\n'));

	process.chdir(appName);

	// Create root package.json with workspaces
	const packageJson = {
		name: appName,
		version: '1.0.0',
		private: true,
		type: 'module',
		workspaces: ['services/*'],
	};

	fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

	console.log(chalk.green('✓ npm initialized with workspaces'));
}

// Initialize Lerna
async function initializeLerna() {
	console.log(chalk.bold.cyan('\n⚙️  Initializing Lerna...\n'));

	// Create lerna.json
	const lernaConfig = {
		$schema: 'node_modules/lerna/schemas/lerna-schema.json',
		version: 'independent',
		npmClient: 'npm',
		useWorkspaces: true,
	};

	fs.writeFileSync('lerna.json', JSON.stringify(lernaConfig, null, 2));

	// Update package.json to include lerna
	const packageJsonPath = 'package.json';
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

	packageJson.devDependencies = {
		...packageJson.devDependencies,
		lerna: '^8.0.0',
	};

	packageJson.scripts = {
		...packageJson.scripts,
		lerna: 'lerna',
	};

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

	console.log(chalk.green('✓ Lerna initialized'));
}

// Install dependencies
async function installDependencies() {
	console.log(chalk.bold.cyan('\n📥 Installing dependencies...\n'));

	try {
		execSync('npm install', { stdio: 'inherit' });
		console.log(chalk.green('\n✓ Dependencies installed successfully!'));
	} catch (error) {
		console.error(chalk.red('✗ Error installing dependencies:'), error.message);
		throw error;
	}
}

// Main execution
async function main() {
	console.log(chalk.bold.magenta('\n🎯 Welcome to NewLink CLI\n'));
	console.log(chalk.gray('='.repeat(50) + '\n'));

	try {
		await getAppName();
		await selectServices();

		if (selectedServices.length === 0) {
			console.log(chalk.yellow('\n⚠️  No services selected. Exiting...'));
			return;
		}

		await createProjectStructure();
		await initializeNpm();
		await initializeLerna();
		await installDependencies();

		console.log(chalk.bold.green('\n🎉 Project setup complete!\n'));
		console.log(chalk.cyan('To get started:'));
		console.log(chalk.white(`  cd ${appName}`));
		console.log(chalk.white(`  npm run lerna run dev\n`));
		console.log(chalk.cyan('Useful Lerna commands:'));
		console.log(chalk.white('  npm run lerna run <cmd>  ') + chalk.gray('- Run command in all packages'));
		console.log(chalk.white('  npm run lerna run build  ') + chalk.gray('- Build all packages'));
		console.log(chalk.white('  npm run lerna clean      ') + chalk.gray('- Remove node_modules from all packages\n'));
	} catch (error) {
		console.error(chalk.bold.red('\n✗ Error:'), error.message);
		process.exit(1);
	}
}

main();
