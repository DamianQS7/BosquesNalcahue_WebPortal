export type ProductType = "Leña" | "Metro Ruma" | "Trozo Aserrable";

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