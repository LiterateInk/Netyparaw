import {PlanningWeek} from "~/models/planning-week";
import {decodeDayItem} from "~/decoders/planning-item";

export const decodePlanningWeek = (object: any):PlanningWeek => {
    return {
        week_id: object.semaines[0].code,
        week_start: new Date(object.semaines[0].dateDebut),
        week_text: object.semaines[0].libelle,
        slots: object.semaines[0].ressources[0].seances.map(decodeDayItem),
    };
};