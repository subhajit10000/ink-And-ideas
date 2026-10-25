import fs from "fs";
import path from "path";
import util from "util";

const LOG_LEVELS = {
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    DEBUG: "DEBUG",
};

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const LOG_DIRECTORY = path.join(process.cwd(), "logs");

if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
}

const getTimestamp = () => new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true 
  });

const getCurrentLogFile = () => {
    let index = 1;

    while (true) {
        const filePath = path.join(LOG_DIRECTORY, `application-${index}.log`);

        if (!fs.existsSync(filePath)) {
            return filePath;
        }

        const { size } = fs.statSync(filePath);

        if (size < MAX_FILE_SIZE) {
            return filePath;
        }

        index++;
    }
};

const writeToFile = (data) => {
    const logFile = getCurrentLogFile();

    fs.appendFileSync(logFile, data + "\n", "utf8");
};

const log = (level, message, meta = null) => {
    const output = {
        timestamp: getTimestamp(),
        level,
        message,
        ...(meta && { meta }),
    };

    const logString = JSON.stringify(output);

    writeToFile(logString);

    // Use depth: null so nested objects/arrays (e.g. validation error lists,
    // full ApiError instances) aren't truncated to "[Object]" in the console.
    const printable = util.inspect(output, { depth: null, colors: false });

    switch (level) {
        case LOG_LEVELS.ERROR:
            console.error(printable);
            break;

        case LOG_LEVELS.WARN:
            console.warn(printable);
            break;

        case LOG_LEVELS.INFO:
            console.info(printable);
            break;

        default:
            console.log(printable);
    }
};

const logger = {
    info(message, meta = null) {
        log(LOG_LEVELS.INFO, message, meta);
    },

    warn(message, meta = null) {
        log(LOG_LEVELS.WARN, message, meta);
    },

    error(message, meta = null) {
        log(LOG_LEVELS.ERROR, message, meta);
    },

    debug(message, meta = null) {
        if (process.env.NODE_ENV === "development") {
            log(LOG_LEVELS.DEBUG, message, meta);
        }
    },
};

export default logger;