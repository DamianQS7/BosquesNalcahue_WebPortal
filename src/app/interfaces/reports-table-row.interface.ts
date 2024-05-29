import { ProductType } from "./reports-response.interface";

export interface ReportsTableRow {
    date:        Date;
    folio:       string | null;
    productType: ProductType;
    clientName:  string | null;
    species:     string[] | null;
}