import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUsecase from "./place-order.usercase"

const mockDate = new Date(2000, 1, 1);

describe.only('PlaceOrderUsecase unit test', () => {
    describe('validateProducts method', () => {
        //@ts-expect-error - no params in constructor
        const placeOrdersacase = new PlaceOrderUsecase();

        it('should throw error if no products are selected', async () => {
            const input: PlaceOrderInputDto = {
                clientId: '0',
                products: []
            };

            await expect(placeOrdersacase['validateProducts'](input))
                .rejects.toThrow(new Error('No products selected'));
        });

        it('should throw an error when product is out of stock', async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: { productId: string}) => {
                    return Promise.resolve({
                        productId,
                        stock: productId === '1' ? 0 : 1
                    })
                })
            };

            //@ts-expect-error - no params in constructor
            placeOrdersacase['_productFacade'] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: '0',
                products: [{productId: '1'}]
            }

            await expect(placeOrdersacase['validateProducts'](input))
                .rejects.toThrow(new Error('Product 1 is not available in stock'));

            input = {
                clientId: '0',
                products: [{productId: '0'}, { productId: '1'}]
            };

            await expect(placeOrdersacase['validateProducts'](input))
                .rejects.toThrow(new Error('Product 1 is not available in stock'));

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: '0',
                products: [{productId: '0'}, { productId: '1'}, { productId: '2'}]
            };

            await expect(placeOrdersacase['validateProducts'](input))
                .rejects.toThrow(new Error('Product 1 is not available in stock'));
                expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe('getProducts method', () => {
        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - no params in constructor
        const placeOrderUsecase = new PlaceOrderUsecase();

        it('should  throw an error when product not found', async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            };

        //@ts-expect-error - force set catalogFacade
            placeOrderUsecase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUsecase['getProduct']('0'))
                .rejects.toThrow(new Error('Product not found'));
        });

        it('should return a product', async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: '0',
                    name: 'Product 0',
                    description: 'Product 0 description',
                    salesPrice: 0
                })
            }
            
            //@ts-expect-error - force set catalogFacade
            placeOrderUsecase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUsecase['getProduct']('0'))
                .resolves.toEqual(
                    new Product({
                        id: new Id('0'),
                        name: 'Product 0',
                        description: 'Product 0 description',
                        salesPrice: 0
                    })
                );

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        })
    });
    
    describe('Execute method', () => {
        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it('should throw an erro when client not found', async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUsecase = new PlaceOrderUsecase();

            //@ts-expect-error - force set clientFacade
            placeOrderUsecase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: '0', products: [] };

            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(new Error('Client not found'));


        });

        it('should throw an error when products are not valid', async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUsecase = new PlaceOrderUsecase();

            const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUsecase, 'validateProducts')
            //@ts-expect-error - not returned never
            .mockRejectedValue(new Error('No products selected'));
            
            //@ts-expect-error - force set clientFacade
            placeOrderUsecase['_clientFacade'] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: '1', products: [] };
            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
                new Error('No products selected')
            );

            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe('place an order', () => {
            const clientProps = {
                id: '1c',
                name: 'Client 0',
                document: '0000',
                email: 'client@user.com',
                street: 'some address',
                number: '1',
                complement: '',
                city: 'some city',
                state: 'some state',
                zipCode: '000'
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps)
            };

            const mockPaymentFacade = {
                process: jest.fn()
            };

            const mockCheckoutRepo = {
                addOrder: jest.fn()
            };

            const mockInvoiceFacade = {
                create: jest.fn().mockResolvedValue({ id: '1i'})
            };

            const placeOrdersacase = new PlaceOrderUsecase(mockClientFacade as any, null, null, mockCheckoutRepo as any, mockInvoiceFacade as any, mockPaymentFacade);

            const products = {
                '1': new Product({
                    id: new Id('1'),
                    name: 'Product 1',
                    description: 'some description',
                    salesPrice: 40
                }),
                '2': new Product({
                    id: new Id('2'),
                    name: `Product 2`,
                    description: 'some description',
                    salesPrice: 30
                })
            };

            //@ts-expect-error - spy on proivate method
            const mockValidateProducts = jest.spyOn(placeOrdersacase, 'validateProducts').mockResolvedValue(null);
            //@ts-expect-error - spy on proivate method
            const mockGetProduct = jest.spyOn(placeOrdersacase, 'getProduct').mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            });

            it('should not be approved', async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1t',
                    orderId: '1o',
                    amount: 100,
                    status: 'error',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const input: PlaceOrderInputDto = {
                    clientId: '1c',
                    products: [{productId: '1'}, {productId: '2'}]
                };
    
                let output = await placeOrdersacase.execute(input);

                expect(output.invoiceId).toBe(null);
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([{productId: '1'}, {productId: '2'}]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c'});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0);

            });

            it('should be approved', async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1t',
                    orderId: '1o',
                    amount: 100,
                    status: 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                        clientId: '1c',
                        products: [{productId: '1'}, {productId: '2'}]
                };

                let output = await placeOrdersacase.execute(input);

                expect(output.invoiceId).toBe('1i');
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([{productId: '1'}, {productId: '2'}]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: '1c'});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
                    name: clientProps.name,
                document: clientProps.document,
                street: clientProps.street,
                complement: clientProps.complement,
                number: clientProps.number,
                city: clientProps.city,
                state: clientProps.state,
                zipCode: clientProps.zipCode,
                items: [
                        {
                            id: products['1'].id.id,
                            name: products['1']. name,
                            price: products['1']. salesPrice
                        },
                        {
                            id: products['2'].id.id,
                            name: products['2']. name,
                            price: products['2']. salesPrice
                        }
                    ]
                });
            })
        });
    });
});