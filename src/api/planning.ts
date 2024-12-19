import {defaultFetcher, Fetcher} from "@literate.ink/utilities";
import type {Session} from "~/models";
import {Request} from "~/core/request";
import {decodePlanningDay} from "~/decoders/planning-day";
import { regex } from "~/const/regex";
import {PlanningDay} from "~/models/planning-day";
import { decodePlanningWeek } from "~/decoders/planning-week";

export const planningFromDay = async (session: Session, date: Date, fetcher: Fetcher = defaultFetcher): Promise<PlanningDay> => {
    if (session.id === undefined)
        throw new Error("Session cookie is not defined ! You must login first.");
    if (session.baseURL === undefined)
        throw new Error("Base URL is not defined ! You must login first.");

    let iso_date = date.toISOString().split("T")[0];
    let date_url = iso_date.split("-").reverse().join("/");

    // Get the planning from a specific day
    const planning_request = new Request(session.baseURL, `/Net-YPareo/index.php/planning/jour/ajax/${date_url}`);
    planning_request.setSession(session);
    const planning_response = await planning_request.send(fetcher);

    // Check if the session is still valid
    if (planning_response.status != 200)
      throw new Error("Failed to fetch planning: The session has expired");

    // Parse the planning
    try {
        const planning = JSON.parse(planning_response.content);
        return (decodePlanningDay(planning));
    } catch (error) {
        throw new Error(`Failed to parse the planning: ${error}`);
    }
};



export const planningFromWeek = async(session: Session, years: string, weekNumber: string, fetcher: Fetcher = defaultFetcher) => {
    if (session.id === undefined)
      throw new Error("Session cookie is not defined ! You must login first.");
    if (session.baseURL === undefined)
        throw new Error("Base URL is not defined ! You must login first.");

    const planning_request = new Request(session.baseURL, `/apprenant/planning/courant/?semaineDebut=${years}${weekNumber}`);
    planning_request.setSession(session);
    const planning_response = await planning_request.send(fetcher);

    // Check if the session is good
    if (planning_response.status != 200)
      throw new Error("Failed to fetch timetable: The session has expired");

    // Parse the planning
    try {
        // Parse the student timetable
        let student_timetable_regex_array = planning_response.content.match(regex.student_timetable);
        if (student_timetable_regex_array === null)
            throw new Error("Failed to get student timetable");
        let planning = JSON.parse(student_timetable_regex_array[1]);
        
        return (decodePlanningWeek(planning));
  } catch (error) {
      throw new Error(`Failed to parse the planning: ${error}`);
  }
}