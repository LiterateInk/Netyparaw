import {defaultFetcher, Fetcher} from "@literate.ink/utilities";
import type {Session} from "~/models";
import {Request} from "~/core/request";
import {decodePlanningDay} from "~/decoders/planning-day";
import {PlanningDay} from "~/models/planning-day";

export const planningFromDay = async (session: Session, date: Date, fetcher: Fetcher = defaultFetcher): Promise<PlanningDay> => {
    if (session.id === undefined)
        throw new Error("Session cookie is not defined ! You must login first.");
    if (session.baseURL === undefined)
        throw new Error("Base URL is not defined ! You must login first.");

    let iso_date = date.toISOString().split("T")[0];
    let date_url = iso_date.split("-").reverse().join("/");

    // Get the planning from a specific day
    console.log(`${session.baseURL}/Net-YPareo/index.php/planning/jour/ajax/${date_url}`);
    const planning_request = new Request(session.baseURL, `/Net-YPareo/index.php/planning/jour/ajax/${date_url}`);
    planning_request.setSession(session);
    const planning_response = await planning_request.send(fetcher);

    // Parse the planning
    try {
        const planning = JSON.parse(planning_response.content);
        return (decodePlanningDay(planning));
    } catch (error) {
        throw new Error(`Failed to parse the planning: ${error}`);
    }
};