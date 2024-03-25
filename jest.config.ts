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
    moduleNameMapper: {
        "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
        "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
        "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
        "^@models/(.*)$": "<rootDir>/src/models/$1",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@validations/(.*)$": "<rootDir>/src/validations/$1",
        "^@logger$": "<rootDir>/src/logger",
    },
};

export default config;
