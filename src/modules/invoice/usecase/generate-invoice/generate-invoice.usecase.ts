import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
    private _invoiceRepository: InvoiceGateway;
  
    constructor(invoiceRepository: InvoiceGateway) {
      this._invoiceRepository = invoiceRepository;
    }
  
    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: {
                city: input.city,
                complement: input.complement,
                number: input.number,
                state: input.state,
                street: input.street,
                zipCode: input.zipCode,
            },
            items: input.items.map((ii): InvoiceItem => new InvoiceItem({
                    name: ii.name,
                    price: ii.price
                })
            )
        });

        const createdInvoice = await this._invoiceRepository.create(invoice);

        return {
            id: createdInvoice.id.id,
            total: createdInvoice.items.reduce((amount, invoice) => amount + invoice.price, 0),
            items: createdInvoice.items.map(ii => { return { id: ii.id.id, name: ii.name,price: ii.price}}),
            name: createdInvoice.name,
            document: createdInvoice.document,
            street: createdInvoice.address.street,
            number: createdInvoice.address.number,
            complement: createdInvoice.address.complement,
            city: createdInvoice.address.city,
            state: createdInvoice.address.state,
            zipCode: createdInvoice.address.zipCode,
        };
    }
  }