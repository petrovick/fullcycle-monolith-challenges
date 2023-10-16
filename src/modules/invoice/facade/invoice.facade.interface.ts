export type FindInvoiceFacadeInputDto = {
    id: string;
}

export type FindInvoiceFacadeOutputDto = {
    id: string;
    name: string;
    document: string;
    address: {
        street: string;
        number: number;
        complement: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    total: number;
    createdAt: Date;
}


export type GenerateInvoiceFacadeInputDto = {
    name: string;
    document: string;
    street: string;
    number: number;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
}

export type GenerateInvoiceFacadeOutputDto = {
    id: string;
    name: string;
    document: string;
    street: string;
    number: number;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    total: number;
}
  
export default interface InvoiceFacadeInterface {
    findInvoice(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
    create(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;
}
  