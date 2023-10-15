import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import {InvoiceModel} from "../repository/invoice.model";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";
import { InvoiceItemModel } from "../repository/invoice-item.model";

describe.only("InvoiceFacade test", () => {
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

  it("should create an invoice", async () => {

    const facade = InvoiceFacadeFactory.create();

    const input: GenerateInvoiceFacadeInputDto = {
      city: 'Gotham city',
      complement: 'None',
      document: '05030717064',
      name: 'Bruce Wayne',
      items: [{id: '1', name: 'Bat-garra', price: 9999}],
      number: 1,
      state: 'NJ',
      street: 'Murphy Avenue',
      zipCode: '53540'
    };

    const output = await facade.create(input);

    expect(output.total).toBe(9999);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
  });
});
