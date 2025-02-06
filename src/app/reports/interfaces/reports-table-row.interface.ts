import { ProductType } from "./product.interface";
import { Report } from "./reports.interface";

export interface ReportsTableRow {
    id:          Report['id'];
    date:        Report['date'];
    folio:       Report['folio'];
    productType: ProductType;
    clientName:  Report['clientName'];
    species:     Report['species'];
    productName: Report['productName'];
    fileId?:     Report['fileId'];
}