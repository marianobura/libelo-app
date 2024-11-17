import { defineStore } from 'pinia';
import axios from 'axios';
import { getUserIdFromToken } from '../utils/auth';

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

<<<<<<< HEAD
                const apiUrl = new URL(`/users/${userId}`, process.env.VUE_APP_API_URL);
                const response = await axios.get(apiUrl, {
=======
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/users/${userId}`, {
>>>>>>> 57c2a6d73f0a25e2a53c829c0de8c719b3d4b888
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
