import BaseModel from "./BaseModel.js";

class Product extends BaseModel {
  constructor() {
    super("./storage/database/products.json");
  }
}

export default new Product();
