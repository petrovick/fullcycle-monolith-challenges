<<<<<<< HEAD

import ProductModel from '../../modules/store-catalog/repository/product.model';
import { InvoiceItemModel } from './../../modules/invoice/repository/invoice-item.model';
import { InvoiceModel } from './../../modules/invoice/repository/invoice.model';
import express, {Express}  from 'express'
import { Sequelize } from 'sequelize-typescript';
import TransactionModel from '../../modules/payment/repository/transaction.model';
// import CustomerModel from '../customer/repository/sequelize/customer.model';
import ProductRoute from './routes/product';

export const app:Express = express();

app.use(express.json());
=======
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { getNonRepeatedPaymentAccordingToTxid } from './teste2';
// import CustomerModel from "../customer/repository/sequelize/customer.model";
// import { customerRoute } from "./routes/customer.route";
// import { productRoute } from "./routes/products.route";
// import ProductModel from "../product/repository/sequelize/product.model";

export const app: Express = express();
app.use(express.json());


app.route('/healthcheck').get((req, res) => {
    req;


    const payments = [
        {endToEndId: '1', txid: 1},
        {endToEndId: '2', txid: null},
        {endToEndId: '3', txid: 2},
        {endToEndId: '4', txid: 3},
        {endToEndId: '5', txid: 1},
        {endToEndId: '6', txid: 4},
        {endToEndId: '7', txid: 5},
        {endToEndId: '8', txid: 6},
        {endToEndId: '9', txid: null},
        {endToEndId: '10', txid: 7},
        {endToEndId: '11', txid: 8},
        {endToEndId: '12', txid: 9},
        {endToEndId: '13', txid: 10},
        {endToEndId: '14', txid: 11},
        {endToEndId: '15', txid: 1},
        {endToEndId: '16', txid: 1},
        {endToEndId: '17', txid: 1},
        {endToEndId: '18', txid: 1},
        {endToEndId: '18', txid: 1},
        {endToEndId: '18', txid: 1},
        {endToEndId: '19', txid: null},
        {endToEndId: '19', txid: null},
        {endToEndId: '20', txid: 1},
    ];

    do {
        const LIMIT = 10;
    
        let paymentsToExecute = getNonRepeatedPaymentAccordingToTxid(payments, 10);
        console.log('paymentsToExecute')
        console.log(paymentsToExecute)
        console.log('')
        console.log('')
    

    } while(payments.filter(x => !!x).length !== 0);




    res.status(200).json({ok: 'ok'});
});
// app.use("/customer", customerRoute);
// app.use("/product", productRoute);
>>>>>>> 4bf26dea51d69ceca2d4d9fd0df995af27c89d83

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
<<<<<<< HEAD
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });

  await sequelize.addModels([InvoiceModel, InvoiceItemModel, ProductModel, TransactionModel]);
  await sequelize.sync();
}

setupDb();

ProductRoute(app)
=======
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
//   await sequelize.addModels([CustomerModel, ProductModel]);
//   await sequelize.sync();
}
setupDb();
>>>>>>> 4bf26dea51d69ceca2d4d9fd0df995af27c89d83
