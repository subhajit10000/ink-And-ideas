import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import App from "./app.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

import connectDB from "./database/index.js";
const PORT = env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();

        logger.info('server to DB connection done')

        App.listen(PORT, () => {
            console.log(`server is running at http://localhost:${PORT}`);

        });

    } catch (error) {
        logger.error('Server failed to start')

        process.exit(1);
    }
}


startServer();