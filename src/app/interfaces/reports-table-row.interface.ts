import { ProductType } from "./reports-response.interface";

export interface ReportsTableRow {
    date:          Date;
    productType:   ProductType;
    clientName:    string | null;
    truckCompany:  string | null;
    species:      string[] | null;
}