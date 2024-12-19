import { defaultFetcher, type Fetcher, getCookiesFromResponse } from "@literate.ink/utilities";
import { Request } from "~/core/request";
import type { Session } from "~/models";
import {regex} from "~/const/regex";
import * as cheerio from 'cheerio';

export const loginCredentials = async (baseURL: string, username: string, password: string, fetcher: Fetcher = defaultFetcher): Promise<Session> => {

    // Check if it is a valid netypareo instance
    const check_request = new Request(baseURL, `/`);
    const check_response = await check_request.send(fetcher);

    if(check_response.status != 302) {
      let netypareo_check_regex_array = check_response.content.match(regex.check_instance_netypareo);
      let ymag_check_regex_array = check_response.content.match(regex.check_instance_ymag);

      if (netypareo_check_regex_array === null)
        throw new Error("Failed to verify instance. Not a valid NetYPareo instance");
      if (ymag_check_regex_array === null)
        throw new Error("Failed to verify instance. Not a valid NetYPareo instance");
    }


    // Get the login page for the CSRF token and the session cookie
    // @ts-ignore : The location header is set in this case
    let instanceURL = check_response.headers.get("location")
    const token_request = new Request(baseURL, `${instanceURL}/login/`);
    const token_response = await token_request.send(fetcher);

    // Parse the session cookie
    let token_cookie = getCookiesFromResponse(token_response).find(cookie => cookie.startsWith("NYPSESSID="));
    if (token_cookie === undefined)
        throw new Error("Failed to get CSRF token cookie");

    // Parse the CSRF token
    let token_csrf_regex_array = token_response.content.match(regex.login_token_csrf);
    if (token_csrf_regex_array === null)
        throw new Error("Failed to get CSRF token");
    let token_csrf = token_csrf_regex_array[1];

    // Get form URL from the login page
    let $token_response = cheerio.load(token_response.content);
    const form_url = $token_response('form').attr('action');
    if (form_url === undefined)
        throw new Error("Failed to get form URL");

    // Create the login session
    let login_session: Session = {
        id: token_cookie.split("=")[1],
        baseURL,
        fetcher
    };

    // Login with the credentials
    const login_request = new Request(baseURL, form_url);
    login_request.setFormData(`login=${encodeURIComponent(username)}&`
        + `password=${encodeURIComponent(password)}&`
        + `screenWidth=1680&screenHeight=1050&`
        + `token_csrf=${token_csrf}&`
        + `btnSeConnecter=Se%20connecter`);
    login_request.setSession(login_session);
    const login_response = await login_request.send(fetcher);
    const login_response_cookies = getCookiesFromResponse(login_response);

    // Create the student session
    const session: Session = {
        id: login_response_cookies.find(cookie => cookie.startsWith("NYPSESSID="))!.split("=")[1],
        baseURL: `${baseURL}${instanceURL.split(".")[1]}.php`,
        fetcher
    };

    // Redirect to the home page
    // @ts-ignore : The location header is set in this case
    const login_redirect = new Request(baseURL, login_response.headers.get('location')!);
    login_redirect.setSession(session);
    const login_redirect_response = await login_redirect.send(fetcher);

    // Check if the login was successful
    if (login_redirect_response.status !== 200)
        throw new Error("Failed to login: Server respond with " + login_response.status);
    let $login_response = cheerio.load(login_redirect_response.content);
    const error_messages = $login_response('.form-wrapper-message.text-error').text().trim();
    if (error_messages !== "")
        throw new Error("Failed to login: " + error_messages);

    // Return the session
    return session;
};

export const loginCookie = async(baseURL: string, cookie: string, fetcher: Fetcher = defaultFetcher): Promise<Session> => {

    // Check if it is a valid netypareo instance
    const check_request = new Request(baseURL, `/`);
    const check_response = await check_request.send(fetcher);

    if(check_response.status != 302) {
      let netypareo_check_regex_array = check_response.content.match(regex.check_instance_netypareo);
      let ymag_check_regex_array = check_response.content.match(regex.check_instance_ymag);

      if (netypareo_check_regex_array === null)
        throw new Error("Failed to verify instance. Not a valid NetYPareo instance");
      if (ymag_check_regex_array === null)
        throw new Error("Failed to verify instance. Not a valid NetYPareo instance");
    }

    // @ts-ignore : The location header is set in this case
    let instanceURL = check_response.headers.get("location")
    // Create the student session
    const session: Session = {
      id: cookie,
      baseURL: `${baseURL}${instanceURL.split(".")[1]}.php`,
      fetcher
    };

    // @ts-ignore : The location header is set in this case
    const check_cookie_request = new Request(session.baseURL, "/apprenant/accueil");
    check_cookie_request.setSession(session);
    const check_cookie_response = await check_cookie_request.send(fetcher);

    // Check if the login was successful
    if (check_cookie_response.status !== 200)
        throw new Error("Failed to login: Server respond with " + check_cookie_response.status);

  // Return the session
  return session;
}