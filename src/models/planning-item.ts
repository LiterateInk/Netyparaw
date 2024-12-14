import {PlanningIcon} from "~/models/planning-icon";

export type PlanningItem = Readonly<{
    id: number,
    type: number,
    color: string,
    name: string,
    start: Date,
    end: Date,
    duration: number,
    details: ReadonlyArray<string>,
    icon: ReadonlyArray<PlanningIcon>,
    subject_id: number,
    subject_coefficient: number,
    subject_groups: ReadonlyArray<number>,
}>;