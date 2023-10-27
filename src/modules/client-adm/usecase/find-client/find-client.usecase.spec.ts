import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  document: "Address 1",
  street: "Address 1",
  complement: "Address 1",
  number: 1,
  city: "Address 1",
  state: "Address 1",
  zipCode: "Address 1",
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("Find Client Usecase unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toEqual(client.document);
    expect(result.street).toEqual(client.street);
    expect(result.complement).toEqual(client.complement);
    expect(result.number).toEqual(client.number);
    expect(result.city).toEqual(client.city);
    expect(result.state).toEqual(client.state);
    expect(result.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
