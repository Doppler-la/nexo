export interface CustomersResponse {
    customers: Customer[]
}

export interface Customer {
    id: number;
    wooUserId: number;
    tangoCode: string;
    tangoCustomerId: number;
    documentType: string;
    documentNumber: string;
    ivaCategory: string;
    priceListNumber: number;
    saleConditionCode: string | null;
    createdAt: string;
    updatedAt: string;
}