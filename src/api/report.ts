import type {Session} from "~/models";
import {defaultFetcher, Fetcher} from "@literate.ink/utilities";
import {Request} from "~/core/request";
import * as cheerio from 'cheerio';
import {decodeReport, decodeReportDetails} from "~/decoders/report";
import {Report, ReportSubjectDetails, ReportSubjectResult} from "~/models/report";

export const report = async (session: Session, fetcher: Fetcher = defaultFetcher): Promise<Report> => {
    if (session.id === undefined)
        throw new Error("Session cookie is not defined ! You must login first.");
    if (session.baseURL === undefined)
        throw new Error("Base URL is not defined ! You must login first.");

    const report_request = new Request(session.baseURL, `/Net-YPareo/index.php/apprenant/bulletin`);
    report_request.setSession(session);
    const report_response = await report_request.send(fetcher);
    const $report_response = cheerio.load(report_response.content);
    return decodeReport($report_response);
};

export const reportSubjectDetails = async (session: Session, subject: ReportSubjectResult, session_id: number, fetcher: Fetcher = defaultFetcher): Promise<ReportSubjectDetails> => {
    const report_request = new Request(session.baseURL, `/Net-YPareo/index.php/apprenant/detail-notes/${subject.registration_id}/${subject.subject_id}/${session_id}`);
    report_request.setSession(session);
    const report_response = await report_request.send(fetcher);
    const $report_response = cheerio.load(report_response.content);
    return decodeReportDetails($report_response);
};