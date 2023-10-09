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

      await writeFileAsync(
        this.dataPath,
        JSON.stringify(updatedRecords, null, 2)
      );
      return updatedRecord;
    } catch (err) {
      throw err;
    }
  }

  async delete(ids) {
    try {
      const deletedRecords = [];
      if (Array.isArray(ids)) {
        for (const id of ids) {
          const record = await this.getById(id);
          deletedRecords.push(record);
        }
      } else {
        const record = await this.getById(id);
        deletedRecords.push(record);
      }

      const dataFile = await readFileAsync(this.dataPath);
      const records = JSON.parse(dataFile);
      const updatedRecords = records.filter((r) => !ids.includes(r.id));

      await writeFileAsync(
        this.dataPath,
        JSON.stringify(updatedRecords, null, 2)
      );
      return ids; // Return the deleted record if needed
    } catch (err) {
      throw err;
    }
  }
}

export default BaseModel;
