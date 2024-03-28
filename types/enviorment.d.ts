declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            MONGO_URI: string;
            API_KEY?: string;
            JWT_ACCESS_SECRET_KEY: string;
            JWT_REFRESH_SECRET_KEY: string;
            SERVICE_EMAIL_URL: string;
        }
    }
}

export type {};
