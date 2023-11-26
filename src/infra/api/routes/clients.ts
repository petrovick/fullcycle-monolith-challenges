import { Application, Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";

export default (app: Application) => {

  app.route('/clients')
    .post(async (req: Request, res: Response) => {
      const procutAdmFacade = ClientAdmFacadeFactory.create();
      try {
        const input: AddClientFacadeInputDto = {
          id: (req.body as any).id,
          name: (req.body as any).name,
          document: (req.body as any).document,
          email: (req.body as any).email,
          street: (req.body as any).street,
          number: (req.body as any).number,
          complement: (req.body as any).complement,
          city: (req.body as any).city,
          state: (req.body as any).state,
          zipCode: (req.body as any).zipCode
        };

        const output = await procutAdmFacade.add(input);
        res.send(output);
      } catch (err) {
        res.status(500).send(err);
      }
    })
};
