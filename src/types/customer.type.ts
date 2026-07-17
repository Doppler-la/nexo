export interface CustomersResponse {
    customers: Customer[]
}

export interface Customer {
    id: number;
    clientId: number;
    wooUserId: number;
    tangoCode: string | null;
    tangoCustomerId: string | null;
    documentType: string | null;
    documentNumber: string | null;
    ivaCategory: string | null;
    priceListNumber: number | null;
    saleConditionCode: string | null;
    discountPercentage: string;
    sellerCode: string | null;
    transportCode: string | null;
    createdAt: string;
    updatedAt: string;
}
