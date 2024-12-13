import { config } from "dotenv";
import { join } from "node:path";
// Load the `.env` file configuration.
config({ path: join(__dirname, ".env"), override: true });

class ExampleSiteError extends Error {
    constructor() {
        super("You need to provide the BASE_URL in the `.env` file.");
        this.name = "ExampleSiteError";
    }
}

if (!process.env.BASE_URL) {
    throw new ExampleSiteError();
}

// Export the credentials.
export const credentials = {
    baseURL: process.env.BASE_URL,

    // you can either login using these
    username: process.env.STUDENT_USERNAME,
    password: process.env.STUDENT_PASSWORD,
};