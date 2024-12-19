import * as netypareo from "../src";
import { credentials } from "./_credentials";

void async function main () {
    const session = await netypareo.loginCredentials(credentials.baseURL!, credentials.username!, credentials.password!);
    // you're now authenticated with the session !
    console.log("You're authenticated with the session", session.id);

    // Get the planning from a specific day
    const report = await netypareo.report(session);
    console.log(JSON.stringify(report, null, 2));
}();