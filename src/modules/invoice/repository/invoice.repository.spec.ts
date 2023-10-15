import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Invoice from "../domain/entity/invoice";
import InvoiceItem from "../domain/entity/invoice-item";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save an invoice", async () => {
    const items = [new InvoiceItem({
      name: 'Bat-garra',
      price: 9999
    })];

    const invoice = new Invoice({
      id: new Id("1"),
      name: 'Bruce Wayne',
      document: '05030717064',
      items,
      address: {
        city: 'Gotham city',
        complement: 'None',
        number: 1,
        state: 'NJ',
        street: 'Murphy Avenue',
        zipCode: '53540'
      }
    });

    const repository = new InvoiceRepository();
    const result = await repository.create(invoice);

    expect(result.id.id).toBe(invoice.id.id);
    expect(result.document).toBe(invoice.document);
    expect(result.name).toBe(invoice.name);
    expect(result.address).toEqual(invoice.address);
  });
});
