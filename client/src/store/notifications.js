import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),
  getters: {
    all: (state) => state.notifications,
  },
  actions: {
    addNotification(notification) {
      this.notifications.push(notification);
      setTimeout(() => {
        this.removeNotification(notification);
      }, 3000);
    },
    removeNotification(notification) {
      this.notifications = this.notifications.filter(
        (n) =>
          n.type !== notification.type && n.message !== notification.message
      );
    },
  },
});
