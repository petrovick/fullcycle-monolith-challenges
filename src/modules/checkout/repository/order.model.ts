import { BelongsTo, Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import ProductModel from "./product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  status: string;

  @BelongsTo(() => ClientModel)
  client: ClientModel;

  @HasMany(() => ProductModel)
  products: ProductModel[];

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
