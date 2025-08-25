export interface Property {
  id: number;
  title: string;
  latitude:number;
  longitude:number;
  propertyType: string;
  transactionType: string;
  description: string;
  address: string;
  price: number;
  features: string[];
  imageUrls: string[];
}

export interface PropertyPage {
  content: Property[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
