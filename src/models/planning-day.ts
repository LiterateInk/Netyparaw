import {PlanningItem} from "~/models/planning-item";

export type PlanningDay = Readonly<{
    day_start_in_minutes: number,
    day_end_in_minutes: number,
    day_number: number,

    week_id: number,
    week_start: Date,
    week_text: string,
    slots: ReadonlyArray<PlanningItem>,
}>