import BaseModel from "./BaseModel.js";

class Log extends BaseModel {
  constructor() {
    super("./storage/database/history.json");
  }
}

export default new Log();
