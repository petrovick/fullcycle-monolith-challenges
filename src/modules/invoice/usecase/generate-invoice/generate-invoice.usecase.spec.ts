import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUsecase from "./generate-invoice.usecase";

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

const MockRepository = () => {
  return {
    create: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn()
  };
};

describe("Process creation of invoice usecase unit test", () => {
  it("should create an invoice", async () => {
    const paymentRepository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(paymentRepository);
    const input: GenerateInvoiceUseCaseInputDto = {
      name: '',
      document: '',
      city: 'Gotham city',
      complement: 'None',
      number: 1,
      state: 'NJ',
      street: 'Murphy Avenue',
      zipCode: '53540',
      items: [{
        name: 'Bat-garra',
        price: 9999
      }]
    };

    const result = await usecase.execute(input);

    expect(paymentRepository.create).toHaveBeenCalled();
    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.zipCode).toBe(invoice.address.zipCode);
    expect(result.total).toBe(9999);
  });
});
