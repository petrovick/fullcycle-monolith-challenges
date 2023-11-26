import { Application, Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";
import PlaceOrderUsecase from "../../../modules/checkout/usecase/place-order/place-order.usercase";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import OrderRepository from "../../../modules/checkout/repository/order.repository";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import { PlaceOrderInputDto } from "../../../modules/checkout/usecase/place-order/place-order.dto";

export default (app: Application) => {

  app.route('/checkout')
    .post(async (req: Request, res: Response) => {
      
      const useCase = new PlaceOrderUsecase(
        ClientAdmFacadeFactory.create(),
        ProductAdmFacadeFactory.create(),
        StoreCatalogFacadeFactory.create(),
        new OrderRepository(),
        InvoiceFacadeFactory.create(),
        PaymentFacadeFactory.create()
      )
      try {
        const input: PlaceOrderInputDto = {
          clientId: (req.body as any).clientId,
          products: (req.body as any)?.products?.map((p: any) => {
            return {
            productId: p.productId
          }})
        };

        const output = await useCase.execute(input);
        res.send(output);
      } catch (err) {
        res.status(500).send(err);
      }
    })
};
