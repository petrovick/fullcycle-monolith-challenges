import Invoice from "../domain/entity/invoice";

export default interface InvoiceGateway {
    create(invoice: Invoice): Promise<Invoice>;
    find(id: string): Promise<Invoice>;
}