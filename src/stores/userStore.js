import { defineStore } from 'pinia';
import axios from 'axios';
import { getUserIdFromToken } from '@/services/auth';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        isAuthenticated: false,
    }),
    getters: {
        favoriteSubject(state) {
            return state.user ? state.user.preferredSubjects : null;
        }
    },
    actions: {
        async fetchUser() {
            const token = localStorage.getItem('token');
            if (!token) {
                this.user = null;
                this.isAuthenticated = false;
                return
            }

            try {
                const userId = getUserIdFromToken();
                if (!userId) {
                    this.user = null;
                    this.isAuthenticated = false;
                    return;
                }

                const apiUrl = new URL(`/api/users/${userId}`, process.env.VUE_APP_API_URL);
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                this.user = response.data.data;
                this.isAuthenticated = true;
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                this.user = null;
                this.isAuthenticated = false;
            }
        },
    },
});
