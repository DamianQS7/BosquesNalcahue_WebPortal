export interface ReportsResponse {
    items:       Report[];
    page:        number;
    pageSize:    number;
    totalCount:  number;
    hasNextPage: boolean;
}

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

export enum ProductType {
    Leña = "Leña",
    MetroRuma = "Metro Ruma",
    TrozoAserrable = "Trozo Aserrable",
}

export interface Product {
    origin:       string;
    species:      string;
    length:       number;
    quantitySum:  number;
    volumeSum:    number;
    measurements: Measurement[];
}

export interface Measurement {
    diameter: number;
    quantity: number;
    volume:   number;
    total:    number;
}

export enum ReportType {
    MultiProductReport = "MultiProductReport",
    SingleProductReport = "SingleProductReport",
}
