import BaseModel from "./BaseModel.js";

class Export extends BaseModel {
  constructor() {
    super("./storage/database/exports.json");
  }
}

export default new Export();
