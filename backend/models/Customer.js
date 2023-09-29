import BaseModel from "./BaseModel.js";

class Customer extends BaseModel {
  constructor() {
    super("./storage/database/customers.json");
  }
}

export default new Customer();
