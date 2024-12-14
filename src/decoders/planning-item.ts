import {PlanningItem} from "~/models/planning-item";
import {decodePlanningIcon} from "~/decoders/planning-icons";

export const decodeDayItem = (item: any): PlanningItem => {
    // [COLOR]
    let color = item.couleur;
    if (color.startsWith("rgba")) {
        const rgba = item.color.slice(5, -1).split(", ");
        const r = parseInt(rgba[0]);
        const g = parseInt(rgba[1]);
        const b = parseInt(rgba[2]);
        const a = parseInt(rgba[3]);
        color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${a.toString(16)}`;
    }

    // [START]
    const minutes_start = item.minuteDebut;
    const start_hours = Math.floor(minutes_start / 60);
    const start_minutes = minutes_start % 60;
    const start = new Date(0, 0, 0, start_hours, start_minutes);

    // [END]
    const minutes_end = item.minuteDebut + item.duree;
    const end_hours = Math.floor(minutes_end / 60);
    const end_minutes = minutes_end % 60;
    const end = new Date(0, 0, 0, end_hours, end_minutes);

    // [ICON]
    const icon = item.icones.map(decodePlanningIcon);

    return {
        id: item.code,
        type: item.type,
        name: item.libelle,
        duration: item.duree,
        details: item.detail,
        subject_id: item.metadatas.codeMatiere,
        subject_coefficient: item.metadatas.coeff,
        subject_groups: item.metadatas.codesGroupes,
        color,
        start,
        end,
        icon,
    };
};