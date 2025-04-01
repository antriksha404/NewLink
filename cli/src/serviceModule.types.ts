export default interface ServiceModuleType {
	name: string;
	packageName: string;
	importStatement: string;
	moduleRegistration: string;
	envVars?: Record<string, string>;
	database?: boolean;
	databaseTypes?: string[];
}
