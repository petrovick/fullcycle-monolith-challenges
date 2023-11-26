import { Application, Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { AddProductFacadeInputDto } from "../../../modules/product-adm/facade/product-adm.facade.interface";

export default (app: Application) => {

  app.route('/products')
    .post(async (req: Request, res: Response) => {
      const procutAdmFacade = ProductAdmFacadeFactory.create();
      try {
        const input: AddProductFacadeInputDto = {
          id: (req.body as any).id,
          name: (req.body as any).name,
          description: (req.body as any).description,
          purchasePrice: (req.body as any).purchasePrice,
          stock: (req.body as any).stock
        };

        const output = await procutAdmFacade.addProduct(input);
        res.send(output);
      } catch (err) {
        res.status(500).send(err);
      }
    })
};
