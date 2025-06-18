import { defineStore } from 'pinia';
import axios from 'axios';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        loading: false,
        error: null
    }),

    getters: {
        unreadNotifications: (state) => {
            return state.notifications.filter(notif => !notif.read);
        },
        totalUnread: (state) => {
            return state.notifications.filter(notif => !notif.read).length;
        }
    },

    actions: {
        async fetchNotifications(userId) {
            this.loading = true;
            this.error = null;

            try {
                const apiUrl = new URL(`/api/notifications/${userId}`, process.env.VUE_APP_API_URL);
                const res = await axios.get(apiUrl.toString());
                this.notifications = res.data.data;
            } catch (err) {
                console.error(err);
                this.error = 'Error al cargar notificaciones';
            } finally {
                this.loading = false;
            }
        },

        async createNotification(notificationData) {
            try {
                const apiUrl = new URL(`/api/notifications`, process.env.VUE_APP_API_URL);
                const res = await axios.post(apiUrl.toString(), notificationData);
                const newNotif = res.data.data;

                const index = this.notifications.findIndex(n => n._id === newNotif._id);
                if (index !== -1) {
                    this.notifications[index] = newNotif;
                } else {
                    this.notifications.unshift(newNotif);
                }
            } catch (err) {
                console.error('Error creando notificación:', err);
            }
        },

        async markAsRead(id) {
            try {
                const apiUrl = new URL(`/api/notifications/${id}`, process.env.VUE_APP_API_URL);
                const res = await axios.put(apiUrl.toString());
                const updated = res.data.data;

                const index = this.notifications.findIndex(n => n._id === id);
                if (index !== -1) {
                    this.notifications[index] = updated;
                }
            } catch (err) {
                console.error('Error marcando como leída:', err);
            }
        }
    }
});