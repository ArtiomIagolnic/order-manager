import fs from "fs";
import util from "util";

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class BaseModel {
  constructor(dataPath) {
    this.dataPath = dataPath;
  }

  async getAll() {
    try {
      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      return records;
    } catch (err) {
      throw err;
    }
  }

  async getById(id) {
    try {
      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      const record = records.find((record) => record.id === id);

      if (!record) {
        throw new Error("Record not found");
      }

      return record;
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
      return data;
    } catch (err) {
      throw err;
    }
  }

  async update(id, newData) {
    try {
      const existingRecord = await this.getById(id);
      const updatedRecord = { ...existingRecord, ...newData };

      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      const updatedRecords = records.map((record) => {
        if (record.id === id) {
          return updatedRecord;
        }
        return record;
      });

      await writeFileAsync(this.dataPath, JSON.stringify(updatedRecords, null, 2));
      return updatedRecord;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const record = await this.getById(id);

      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      const updatedRecords = records.filter((r) => r.id !== id);

      await writeFileAsync(this.dataPath, JSON.stringify(updatedRecords, null, 2));
      return record; // Return the deleted record if needed
    } catch (err) {
      throw err;
    }
  }
}

export default BaseModel;
