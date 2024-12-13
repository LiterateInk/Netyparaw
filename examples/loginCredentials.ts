import * as netypareo from "../src";
import { credentials } from "./_credentials";

void async function main () {
    const session = await netypareo.loginCredentials(credentials.baseURL!, credentials.username!, credentials.password!);
    // you're now authenticated with the session !
    // you can now use the session to make further requests.
    console.log("You're authenticated with the session", session.id);
}();