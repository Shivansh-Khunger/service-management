declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			MONGO_URI: string;
			API_KEY?: string;
		}
	}
}

export type {};
