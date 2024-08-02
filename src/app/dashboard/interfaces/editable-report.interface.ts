import { Product, ProductType } from "./reports-response.interface";

export interface EditableReport {
    productType:     ProductType; // Hidden
    id:              string;      // Hidden
    fileId?:          string       // Hidden
    folio:           string;      // readonly
    date:            Date;        // readonly
    clientId:        null | string;
    clientName:      null | string;
    truckCompany:    null | string;
    truckDriver:     null | string;
    truckDriverId:   null | string;
    truckPlate:      null | string;
    origin?:         null | string;
    productName:     null | string;
    products?:       Product[]; // Only need the origin, species, and length property of each one.
}