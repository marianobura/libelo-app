import { defineStore } from 'pinia';
import axios from 'axios';
import { getUserIdFromToken } from '../services/auth';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        isAuthenticated: false,
    }),
    actions: {
        async fetchUser() {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const userId = getUserIdFromToken();

                const apiUrl = new URL(`/api/users/${userId}`, process.env.VUE_APP_API_URL);
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                this.user = response.data.data;
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
            }
        },
    },
});
