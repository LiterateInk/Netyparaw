export type ReportSessionOption = Readonly<{
    session_id: number;
    session_code: number;
    name: string;
}>

export interface ReportSessionDictionary {
    [Key: number]: ReportSession;
}

export type ReportSession = Readonly<{
    subject_list: Array<ReportSubjectResult>;
    group_average?: number;
    group_average_min?: number;
    group_average_max?: number;
    average?: number;
    teacher_comment?: string;
    registration_id: number;
    student_id: number;
}>

export type ReportSubjectResult = Readonly<{
    registration_id: number;
    student_id: number;
    subject_id: number;
    subject_name: string;
    coefficient: number;
    group_average?: number;
    group_average_min?: number;
    group_average_max?: number;
    average?: number;
    teacher_comment?: string;
}>

export type Report = Readonly<{
    session_list: Array<ReportSessionOption>;
    session: ReportSessionDictionary,
}>