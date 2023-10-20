import eventEmitter from "./EventEmmiter.js";
import logEvent from "../utils/logEventsUtility.js";

const eventListeners = {
  entityUpdatedListener: () => {
    eventEmitter.on("EntityUpdated", (eventData) => {
      const logMessage = `${eventData.entityName} has been updated`;
      logEvent(logMessage);
    });
  },
  entityCreatedListener: () => {
    eventEmitter.on("EntityCreated", (eventData) => {
      const logMessage = `${eventData.entityName} has been created`;
      logEvent(logMessage);
    });
  },
  entityDeletedListener: () => {
    eventEmitter.on("EntityDeleted", (eventData) => {
      const logMessage = `${eventData.entityName} has been deleted`;
      logEvent(logMessage);
    });
  },
};

export default eventListeners;
