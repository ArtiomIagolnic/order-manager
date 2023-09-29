import fs from "fs";

class BaseModel {
  constructor(dataPath) {
    this.dataPath = dataPath;
  }

  getAll(callback) {
    fs.readFile(this.dataPath, (err, dataFile) => {
      if (err) {
        return callback(err, null);
      }

      const records = JSON.parse(dataFile);
      callback(null, records);
    });
  }
  getById(id, callback) {
    fs.readFile(this.dataPath, (err, dataFile) => {
      if (err) {
        return callback(err, null);
      }
      const records = JSON.parse(dataFile);
      const record = records.find((record) => record.id === id);

      if (!record) {
        return callback(new Error("Record not found"), null);
      }
      callback(null, record);
    });
  }
  insert(data, callback) {
    fs.readFile(this.dataPath, (err, dataFile) => {
      if (err) {
        return callback(err, null); // Pass the error as the first argument
      }

      const records = JSON.parse(dataFile);
      records.push(data);

      // Write the updated records back to the file
      fs.writeFile(this.dataPath, JSON.stringify(records, null, 2), (err) => {
        if (err) {
          return callback(err, null); // Pass the error as the first argument
        }

        callback(null, data);
      });
    });
  }

  update(id, newData, callback) {
    this.getById(id, (err, existingRecord) => {
      if (err) {
        return callback(err, null);
      }
      const updatedRecord = { ...existingRecord, ...newData };

      fs.readFile(this.dataPath, (err, dataFile) => {
        if (err) {
          return callback(err, null);
        }
        const records = JSON.parse(dataFile);
        const updatedRecords = records.map((record) => {
          if (record.id === id) {
            return updatedRecord;
          }
          return record;
        });
        fs.writeFile(
          this.dataPath,
          JSON.stringify(updatedRecords, null, 2),
          (err) => {
            if (err) {
              return callback(err, null);
            }
            callback(null, updatedRecord);
          }
        );
      });
    });
  }

  delete(id, callback) {
    // Use getById to find the record with the specified ID
    this.getById(id, (err, record) => {
      if (err) {
        return callback(err, null);
      }

      // Record exists, proceed with deletion
      fs.readFile(this.dataPath, (err, dataFile) => {
        if (err) {
          return callback(err, null);
        }

        const records = JSON.parse(dataFile);
        const updatedRecords = records.filter((r) => r.id !== id);

        // Write the updated records back to the file
        fs.writeFile(
          this.dataPath,
          JSON.stringify(updatedRecords, null, 2),
          (err) => {
            if (err) {
              return callback(err, null);
            }

            callback(null, record); // Return the deleted record if needed
          }
        );
      });
    });
  }
}

export default BaseModel;
