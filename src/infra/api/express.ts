
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

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });

  await sequelize.addModels([InvoiceModel, InvoiceItemModel, ProductModel, TransactionModel]);
  await sequelize.sync();
}

setupDb();

ProductRoute(app)