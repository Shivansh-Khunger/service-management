// Import necessary modules
import fs from 'node:fs'; // 'fs' for file system operations
import https from 'node:https'; // 'https' for HTTPS servers
import cookieParser from 'cookie-parser'; // 'cookie-parser' for parsing cookies
import express from 'express'; // 'express' for web applications
import connectToDb from './config/db'; // 'connectToDb' for database connection
import setHeaders from './config/headers'; // 'setHeaders' for setting HTTP headers
import { httpLogger, logger } from './logger'; // 'httpLogger' and 'logger' for logging

// Import route modules
import categoryRoutes from '@routes/private/categoryRoutes';
import subCategoryRoutes from '@routes/private/subCategoryRoutes';
import businessRoutes from '@routes/public/businessRoutes';
import dealRoutes from '@routes/public/dealRoutes';
import productRoutes from '@routes/public/productRoutes';
import serviceRoutes from '@routes/public/serviceRoutes';
import userRoutes from '@routes/public/userRoutes';
import { stdLimiter } from './config/rateLimiter';

// Define the port on which the server will run
const PORT = process.env.PORT || 3001;

// Initialize the express application
const app = express();

// Middleware setup for the Express application
app.use(cookieParser(process.env.COOKIE_SECRET_KEY)); // Parse cookies with secret key
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(setHeaders); // Set HTTP headers for CORS
app.use(httpLogger); // Log HTTP requests

(async () => {
    // Connect to the database
    await connectToDb();

    // Start the server and log the URL at which it's running
    // The URL depends on whether the environment is development or production
    if (process.env.NODE_ENV === 'development') {
        try {
            const options = {
                key: fs.readFileSync('./ssl/cert.key'), // Read SSL key
                cert: fs.readFileSync('./ssl/cert.crt'), // Read SSL certificate
            };

            // Create HTTPS server in development
            https.createServer(options, app).listen(PORT, () => {
                logger.info(`-> now listening at https://localhost:${PORT}/`); // Log server URL
            });
        } catch (err) {
            // Fallback to HTTP server if SSL setup fails
            app.listen(PORT, () => {
                logger.info('dev-server started ^_~'); // Log server URL
            });
        }
    } else if (process.env.NODE_ENV === 'production') {
        // Create HTTP server in production
        app.listen(PORT, () => {
            logger.info('server started ^_~'); // Log server start
        });
    }
})();

// Define a route for the base URL that sends a welcome message
app.get('/', (req, res) => {
    res.status(200).send('Welcome to service-management of IJUJU ^_+');
});

// Define the version number for the API
const versionNumber = 'v1';

// Add the user, business, product and deals routes to the application
// The routes are prefixed with the version number
// Public Routes
app.use(`/${versionNumber}/d`, dealRoutes);

app.use(stdLimiter);
app.use(`/${versionNumber}/s`, serviceRoutes);
app.use(`/${versionNumber}/u`, userRoutes);
app.use(`/${versionNumber}/b`, businessRoutes);
app.use(`/${versionNumber}/p`, productRoutes);

// Private Routes
app.use(`/${versionNumber}/c`, categoryRoutes);
app.use(`/${versionNumber}/sc`, subCategoryRoutes);
