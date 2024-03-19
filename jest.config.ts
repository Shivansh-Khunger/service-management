import type { Config } from "jest";

const config: Config = {
	verbose: true,
	moduleFileExtensions: ["ts", "js"],
	transform: {
		"^.+\\.(ts)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
			},
		],
	},
	testMatch: ["**/tests/**/*.test.(js|ts)"],
	modulePathIgnorePatterns: ["./tests/config", "./dist"],
};

export default config;
