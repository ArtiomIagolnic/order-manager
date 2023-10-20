import fs from "fs";
import timeStampFormat from "./timeStampUtility.js";

const historyFilePath = "./storage/database/history.json";

const logEvent = (eventName) => {
  const historyData = fs.existsSync(historyFilePath)
    ? JSON.parse(fs.readFileSync(historyFilePath))
    : [];

  historyData.push({
    event: eventName,
    timestamp: timeStampFormat(new Date()),
  });

  fs.writeFileSync(historyFilePath, JSON.stringify(historyData, null, 2));
};

export default logEvent;
