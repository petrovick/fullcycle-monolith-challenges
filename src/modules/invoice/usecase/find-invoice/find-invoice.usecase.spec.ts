import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import { FindInvoiceUseCaseInputDTO } from "./find-invoice.dto";
import FindInvoiceUsecase from "./find-invoice.usecase";

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
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  };
};

describe("Process search of invoice usecase unit test", () => {
  it("should create an invoice", async () => {
    const paymentRepository = MockRepository();
    const usecase = new FindInvoiceUsecase(paymentRepository);
    const input: FindInvoiceUseCaseInputDTO = {
      id: '1'
    };

    const result = await usecase.execute(input);

    expect(paymentRepository.find).toHaveBeenCalledWith(input.id);
    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.total).toBe(9999);
  });
});
