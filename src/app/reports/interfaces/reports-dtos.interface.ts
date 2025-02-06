import { Report } from "./reports.interface";

export type UpdateReportRequest = Omit<Report, 'fileId' | 'id'>;
export type DeleteReportRequest = Report['id'];
export type GetReportByIdRequest = Report['id'];

export interface GetReportsResponse {
    items:       Report[];
    page:        number;
    pageSize:    number;
    totalCount:  number;
    hasNextPage: boolean;
}