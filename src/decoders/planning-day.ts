import {PlanningDay} from "~/models/planning-day";
import {decodeDayItem} from "~/decoders/planning-item";

export const decodePlanningDay = (object: any):PlanningDay => {
    return {
        day_start_in_minutes: object.configuration.minuteDebut,
        day_end_in_minutes: object.configuration.minuteFin,
        day_number: object.configuration.jours[0],

        week_id: object.semaines[0].code,
        week_start: new Date(object.semaines[0].dateDebut),
        week_text: object.semaines[0].libelle,
        slots: object.semaines[0].ressources[0].seances.map(decodeDayItem),
    };
};