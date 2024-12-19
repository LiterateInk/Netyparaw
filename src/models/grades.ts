export type Grade = Readonly<{
    teacher_name: string;
    teacher_initials: string;
    grade_type: string;
    subject_name?: string;
    subject_id?: number;
    date: Date;
    name: string;
    coefficient: number;
    grade?: number;
    absent?: boolean;
    absence_reason?: string;
}>;