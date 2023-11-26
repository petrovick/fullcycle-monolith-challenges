import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";
import ProductModel from "./product.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create({
      id: order.id.id,
      status: order.status,
      updatedAt: order.updatedAt,
      createdAt: order.createdAt
    });
  }

  async findOrder(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ 
      where: { id },
      include: [ClientModel, ProductModel]
    });

    return this.mapModelToDomain(orderModel);
  }

  mapModelToDomain(orderModel: OrderModel): Order {
    const client = new Client({
      id: new Id(orderModel.client.id),
      name: orderModel.client.name,
      document: orderModel.client.document,
      email: orderModel.client.email,
      street: orderModel.client.street,
      number: orderModel.client.number,
      city: orderModel.client.city,
      complement: orderModel.client.complement,
      state: orderModel.client.state,
      zipCode: orderModel.client.zipCode
    });

    const products: Product[] = orderModel.products?.map(p => new Product({
      id: new Id(p.id),
      name: p.name,
      description: p.description,
      salesPrice: p.salesPrice
    }))

    return new Order({
      id: new Id(orderModel.id),
      status: orderModel.status,
      client,
      products
    });
  }
}