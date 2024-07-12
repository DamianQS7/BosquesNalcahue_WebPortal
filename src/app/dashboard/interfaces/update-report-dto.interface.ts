import { Product, ProductType, ReportType } from "./reports-response.interface";

export interface UpdateReportDto {
    origin?:         null | string;
    truckHeight?:    number;
    truckLength?:    number;
    banks?:          number;
    palomeraHeight?: number;
    palomeraWidth?:  number;
    finalQuantity:   number;
    reportType:      ReportType;
    productType:     ProductType;
    operatorName:    string;
    folio:           string;
    date:            Date;
    clientName:      null | string;
    clientId:        null | string;
    truckCompany:    null | string;
    truckDriver:     null | string;
    truckDriverId:   null | string;
    truckPlate:      null | string;
    species:         string[] | null;
    productName:     null | string;
    finalVolume?:    number;
    products?:       Product[];
}