import { ProductType } from "./reports-response.interface";

export interface ReportsTableRow {
    id:          string;
    date:        Date;
    folio:       string | null;
    productType: ProductType;
    clientName:  string | null;
    species:     string[] | null;
    productName: string | null;
}