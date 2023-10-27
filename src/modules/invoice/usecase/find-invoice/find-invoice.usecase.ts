import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUsecase implements UseCaseInterface {
    private _invoiceRepository: InvoiceGateway;
  
    constructor(invoiceRepository: InvoiceGateway) {
      this._invoiceRepository = invoiceRepository;
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        if(!input.id) {
            throw new Error('Id was not provided');
        }

        const invoice = await this._invoiceRepository.find(input.id);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
              street: invoice.address.street,
              number: invoice.address.number,
              complement: invoice.address.complement,
              city: invoice.address.city,
              state: invoice.address.state,
              zipCode: invoice.address.zipCode
            },
            total: invoice.items.reduce((amount, invoice) => amount + invoice.price, 0),
            items: invoice.items.map(ii => { return { id: ii.id.id, name: ii.name,price: ii.price}}),
            createdAt: invoice.createdAt
        };
    }
}