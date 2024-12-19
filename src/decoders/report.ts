import * as cheerio from 'cheerio';
import {
    Report,
    ReportSession,
    ReportSessionDictionary,
    ReportSessionOption,
    ReportSubjectResult
} from "~/models/report";
import {Cheerio} from "cheerio";
import { AnyNode } from 'node_modules/domhandler/lib/esm/node';

export const decodeReportSessionOption = ($: cheerio.CheerioAPI): Array<ReportSessionOption> => {
    const session_selector = $("select[id='bulletin-filtre-periode']");
    if (session_selector.length === 0) return [];
    const session_options = session_selector.find("option");
    if (session_options.length === 0) return [];
    const session_list: Array<ReportSessionOption> = [];
    session_options.each((index, element) => {
        const session_id = parseInt($(element).attr("value") ?? "-1");
        const session_code = parseInt($(element).attr("data-code-session") ?? "-1")
        const name = $(element).text();
        session_list.push({session_id, session_code, name});
    });
    return session_list;
};

export const decodeReportSubjectResult = ($: any): ReportSubjectResult => {
    const subject_name_selector = $("td > span");
    const coefficient_selector = $("td.coeff");
    const group_average_selector = $("td.moyenne-grp");
    const group_average_min_selector = $("td.moyenne-mini-grp");
    const group_average_max_selector = $("td.moyenne-maxi-grp");
    const average_selector = $("td.moyenneApp");
    const teacher_comment_selector = $("td.cell-appreciation");

    const subject_name = subject_name_selector.text().trim();
    const coefficient = parseFloat(coefficient_selector.text().replace(",", "."));
    const group_average = group_average_selector.text().trim() == "" ? undefined : parseFloat(group_average_selector.text().replace(",", "."));
    const group_average_min = group_average_min_selector.text().trim() == "" ? undefined : parseFloat(group_average_min_selector.text().replace(",", "."));
    const group_average_max = group_average_max_selector.text().trim() == "" ? undefined : parseFloat(group_average_max_selector.text().replace(",", "."));
    const average = average_selector.text().trim() == "" ? undefined : parseFloat(average_selector.text().replace(",", "."));
    const teacher_comment = teacher_comment_selector.text().trim() == "" ? undefined : teacher_comment_selector.text().trim();
    const registration_id = parseInt(teacher_comment_selector.attr("data-code_inscription") ?? "-1");
    const student_id = parseInt(teacher_comment_selector.attr("data-code_apprenant") ?? "-1");
    const subject_id = parseInt(teacher_comment_selector.attr("data-code_matiere") ?? "-1");

    return {
        subject_id,
        subject_name,
        coefficient,
        group_average,
        group_average_min,
        group_average_max,
        average,
        teacher_comment,
        registration_id,
        student_id
    };
};

export const decodeReportSubjectResultList = ($: any): Array<ReportSubjectResult> => {
    const subject_list: Array<ReportSubjectResult> = [];
    const subject_rows = $.find("tr");
    subject_rows.each((index: any, element: string | AnyNode | AnyNode[] | Buffer<ArrayBufferLike>) => {
        const cheerio_api = cheerio.load(element);
        const subject_result = decodeReportSubjectResult(cheerio_api);
        subject_list.push(subject_result);
    });
    return subject_list;
};

export const decodeReportSession = ($: cheerio.CheerioAPI, session: ReportSessionOption): ReportSession => {
    const div_selector = $(`div[id="bulletin_${session.session_id}"]`);
    const table_selector = div_selector.find("table");
    const tbody_selector = table_selector.find("tbody");
    const tfoot_selector = table_selector.find("tfoot");

    const subject_list = decodeReportSubjectResultList($(tbody_selector));
    const group_average_selector = tfoot_selector.find("td.moyenne-grp");
    const group_average_min_selector = tfoot_selector.find("td.moyenne-mini-grp");
    const group_average_max_selector = tfoot_selector.find("td.moyenne-maxi-grp");
    const average_selector = tfoot_selector.find("td.moyenneApp");
    const teacher_comment_selector = tfoot_selector.find("td.cell-appreciation");

    const group_average = group_average_selector.text().trim() == "" ? undefined : parseFloat(group_average_selector.text().replace(",", "."));
    const group_average_min = group_average_min_selector.text().trim() == "" ? undefined : parseFloat(group_average_min_selector.text().replace(",", "."));
    const group_average_max = group_average_max_selector.text().trim() == "" ? undefined : parseFloat(group_average_max_selector.text().replace(",", "."));
    const average = average_selector.text().trim() == "" ? undefined : parseFloat(average_selector.text().replace(",", "."));
    const teacher_comment = teacher_comment_selector.text().trim() == "" ? undefined : teacher_comment_selector.text().trim();
    const registration_id = parseInt(teacher_comment_selector.attr("data-code_inscription") ?? "-1");
    const student_id = parseInt(teacher_comment_selector.attr("data-code_apprenant") ?? "-1");

    return {
        subject_list,
        group_average,
        group_average_min,
        group_average_max,
        average,
        teacher_comment,
        registration_id,
        student_id
    }
};

export const decodeReportSessionDictionary = ($: cheerio.CheerioAPI, session_list: Array<ReportSessionOption>): ReportSessionDictionary => {
    let reportSessionDictionary: ReportSessionDictionary = {};
    session_list.forEach((session) => {
        reportSessionDictionary[session.session_id] = decodeReportSession($, session);
    });
    return reportSessionDictionary;
};

export const decodeReport = ($: cheerio.CheerioAPI): Report => {
    const session_list = decodeReportSessionOption($);
    const session = decodeReportSessionDictionary($, session_list);
    return {session_list, session};
};
