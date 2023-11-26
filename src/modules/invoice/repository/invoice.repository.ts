import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice";
import InvoiceItem from "../domain/entity/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async create(invoice: Invoice): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      createdAt: invoice.createdAt || new Date(),
      updatedAt: invoice.updatedAt ||new Date(),
    });
    
    const invoiceItemsModel: InvoiceItemModel[] = []
    for (const item of invoice.items) {
      const invoiceItem = await InvoiceItemModel.create({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: invoiceModel.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      invoiceItemsModel.push(invoiceItem);
    }
    invoiceModel.items = invoiceItemsModel;

    return this.modelToDomain(invoiceModel);
  }
  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel]
    });

    if (!invoiceModel) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return this.modelToDomain(invoiceModel);
  }

  private modelToDomain(invoiceModel: InvoiceModel): Invoice {
    return new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: {
        city: invoiceModel.city,
        complement: invoiceModel.complement,
        number: invoiceModel.number,
        state: invoiceModel.state,
        street: invoiceModel.street,
        zipCode: invoiceModel.zipCode,
      },
      items: invoiceModel.items.map((ii: InvoiceItemModel): InvoiceItem => new InvoiceItem({
          id: new Id(ii.id),
          name: ii.name,
          price: ii.price
        })
      )
    });
  }
}
