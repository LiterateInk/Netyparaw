import {PlanningItem} from "~/models/planning-item";

export type PlanningWeek = Readonly<{
    week_id: number,
    week_start: Date,
    week_text: string,
    slots: ReadonlyArray<PlanningItem>,
}>