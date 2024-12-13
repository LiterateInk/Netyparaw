import { defaultFetcher, type Fetcher, getCookiesFromResponse } from "@literate.ink/utilities";
import { Request } from "~/core/request";
import type { Session } from "~/models";
import {regex} from "~/const/regex";

export const loginCredentials = async (baseURL: string, username: string, password: string, fetcher: Fetcher = defaultFetcher): Promise<Session> => {

    // Get the CSRF token from the login page
    const token_request = new Request(baseURL, `/Net-YPareo/index.php/login/`);
    const token_response = await token_request.send(fetcher);
    let token_csrf_regex_array = token_response.content.match(regex.login_token_csrf);
    if (token_csrf_regex_array === null)
        throw new Error("Failed to get CSRF token");
    let token_csrf = token_csrf_regex_array[1];

    // Login
    const login_request = new Request(baseURL, `/Net-YPareo/index.php/authentication/`);
    login_request.setFormData(`login=${encodeURIComponent(username)}&`
        + `password=${encodeURIComponent(password)}&`
        + `screenWidth=1920&screenHeight=1080&`
        + `token_csrf=${token_csrf}&`
        + `btnSeConnecter=Se%2Bconnecter`);
    const login_response = await login_request.send(fetcher);

    // Get the session cookie
    let cookies = getCookiesFromResponse(login_response);
    let session_cookie = cookies.find(cookie => cookie.startsWith("NYPSESSID="));
    if (session_cookie === undefined)
        throw new Error("Failed to get session cookie");

    // Create the session
    let session: Session = {
        id: session_cookie.split("=")[1],
        baseURL,
        fetcher
    }

    // TODO: check if the login was successful ?
    // we need someone with credentials login to check/implement for us
    return session;
};