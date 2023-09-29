import BaseModel from "./BaseModel.js";

class Order extends BaseModel {
  constructor() {
    super("./storage/database/orders.json");
  }
}
export default new Order();
