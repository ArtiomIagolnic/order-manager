<template>
    <Transition name="notifications">
        <div v-if="notifications.length" class="notification-container">
            <div v-for="notification in notifications" :key="notification" :class="notificationClass(notification)">
                {{ notification.message }}
            </div>
        </div>
    </Transition>
</template>
  
<script>
import { useNotificationStore } from '@/store/notifications';

export default {
    computed: {
        notifications() {
            return useNotificationStore().all;
        },
    },
    methods: {
        notificationClass(notification) {
            if (notification.type === 'added') {
                return 'notification added';
            } else if (notification.type === 'deleted') {
                return 'notification deleted';
            } else if (notification.type === 'updated') {
                return 'notification updated';
            }
            return 'notification';
        },
    },
};
</script>
  
<style scoped>
.notification-container {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column-reverse;
    /* To stack notifications from bottom to top */
}

.notification {
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    padding: 1rem 1.5rem;
    margin-top: 0.5rem;
    border-radius: 0.25rem;
    max-width: 300px;
    font-size: 16px;
}

.added {
    background-color: #d1f5e0;
    /* Green for added */
}

.deleted {
    background-color: #f45b5b;
    /* Red for deleted */
}

.updated {
    background-color: #61db8a;
}

.notifications-enter-active,
.notifications-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
    /* Transition properties */
}

.notifications-enter-from,
.notifications-leave-to {
    opacity: 0;
    transform: translateY(10px);
}</style>
  