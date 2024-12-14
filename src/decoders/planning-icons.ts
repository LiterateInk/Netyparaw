import {PlanningIcon} from "~/models/planning-icon";

export const decodePlanningIcon = (item: any): PlanningIcon => {
    return {
        web_class: item.classe,
        text: item.libelle,
    };
}