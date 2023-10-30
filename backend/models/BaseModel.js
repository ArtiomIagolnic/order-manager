import fs from "fs";
import util from "util";
import eventEmitter from "../modules/EventEmmiter.js";

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class BaseModel {
  constructor(dataPath) {
    this.dataPath = dataPath; // The path to the JSON data file for this model.
  }

  async getAll() {
    try {
      const records = JSON.parse(await readFileAsync(this.dataPath));
      return records;
    } catch (err) {
      throw err;
    }
  }

  async getById(ids) {
    try {
      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      const result = [];

      for (const id of Array.isArray(ids) ? ids : [ids]) {
        const record = records.find((record) => record.id === id);
        if (record) {
          result.push(record);
        }
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  async insert(data) {
    try {
      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      records.push(data);

      await writeFileAsync(this.dataPath, JSON.stringify(records, null, 2));
      this.emitEntityCreated(data);

      return data;
    } catch (err) {
      throw err;
    }
  }

  async update(id, newData) {
    try {
      const dataFile = await readFileAsync(this.dataPath);
      let records = JSON.parse(dataFile);
      for (let i = 0; i < records.length; i++) {
        if (records[i].id === id) {
          records[i] = { ...records[i], ...newData };
          break;
        }
      }
      await writeFileAsync(this.dataPath, JSON.stringify(records, null, 2));
      this.emitEntityUpdated(newData);

      return records.find((record) => record.id === id);
    } catch (err) {
      throw err;
    }
  }

  async delete(ids) {
    try {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      const updatedRecords = records.filter((r) => !ids.includes(r.id));

      await writeFileAsync(
        this.dataPath,
        JSON.stringify(updatedRecords, null, 2)
      );
      this.emitEntityDeleted(ids);

      return ids;
    } catch (err) {
      throw err;
    }
  }

  emitEntityCreated(entity) {
    eventEmitter.emit("EntityCreated", {
      entityName: this.constructor.name,
      entityData: entity,
    });
  }
  async emitEntityUpdated(entity) {
    eventEmitter.emit("EntityUpdated", {
      entityName: this.constructor.name,
      entityData: entity,
    });
  }
  emitEntityDeleted(entity) {
    eventEmitter.emit("EntityDeleted", {
      entityName: this.constructor.name,
      entityData: entity,
    });
  }
}

export default BaseModel;
