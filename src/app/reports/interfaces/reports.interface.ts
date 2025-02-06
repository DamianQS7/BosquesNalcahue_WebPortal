import { Product, ProductType } from "./product.interface";

export type ReportType = "MultiProductReport" | "SingleProductReport";

export interface Report {
    origin?:         null | string;
    fileId?:         string;
    truckHeight?:    number;
    truckLength?:    number;
    banks?:          number;
    palomeraHeight?: number;
    palomeraWidth?:  number;
    finalQuantity:   number;
    id:              string;
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

export interface EditableReport {
    clientName: Report['clientName'],
    clientId: Report['clientId'],
    truckCompany: Report['truckCompany'],
    truckDriver: Report['truckDriver'],
    truckDriverId: Report['truckDriverId'],
    truckPlate: Report['truckPlate'],
}


