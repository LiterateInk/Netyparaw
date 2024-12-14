import * as netypareo from "../src";
import { credentials } from "./_credentials";

void async function main () {
    const session = await netypareo.loginCredentials(credentials.baseURL!, credentials.username!, credentials.password!);
    // you're now authenticated with the session !
    console.log("You're authenticated with the session", session.id);

    // Get the planning from a specific day
    const date = new Date("2024-12-16");
    const planning = await netypareo.planningFromDay(session, date);

    let startHour = Math.floor(planning.day_start_in_minutes / 60);
    let startMinutes = planning.day_start_in_minutes % 60;
    let endHour = Math.floor(planning.day_end_in_minutes / 60);
    let endMinutes = planning.day_end_in_minutes % 60;

    console.log("========== Planning from the day ==========");
    console.log("Your day starts at", startHour, ":", startMinutes, "and ends at", endHour, ":", endMinutes);
    console.log("The day number is", planning.day_number);

    console.log("Week ID:", planning.week_id);
    console.log("Week start:", planning.week_start);
    console.log("Week text:", planning.week_text);

    console.log("Slots:");
    for (let slot of planning.slots) {
        console.log("  -----", slot.name, "-----");
        console.log("  Type:", slot.type);
        console.log("  Duration:", slot.duration);
        console.log("  Details:", slot.details);
    }
}();