<script setup>
import { useRouter } from 'vue-router';
import { auth, googleProvider, signInWithPopup } from '@/services/firebase';
import axios from 'axios';

const router = useRouter();

const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const firstName = user.displayName.split(' ')[0];
        const lastName = user.displayName.split(' ')[1] || '';
        const email = user.email;

        const apiUrl = new URL('/api/users/google-login', process.env.VUE_APP_API_URL);
        const response = await axios.post(apiUrl.toString(), {
            firstName: firstName,
            lastName: lastName,
            displayName: `${firstName} ${lastName}`,
            email,
            password: '',
            role: 'student',
            google: true,
        });

        if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            router.push('/');
        }
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
};
</script>

<template>
    <button @click="handleGoogleLogin" class="flex items-center justify-center gap-2 h-12 w-full bg-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-300">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.06 12.25C23.06 11.47 22.99 10.72 22.86 10H12.5V14.255H18.42C18.165 15.63 17.39 16.795 16.225 17.575V20.335H19.78C21.86 18.42 23.06 15.6 23.06 12.25Z" fill="#4285F4"/>
            <path d="M12.5 23C15.47 23 17.96 22.015 19.78 20.335L16.225 17.575C15.24 18.235 13.98 18.625 12.5 18.625C9.63501 18.625 7.21001 16.69 6.34501 14.09H2.67001V16.94C4.48001 20.535 8.20001 23 12.5 23Z" fill="#34A853"/>
            <path d="M6.345 14.09C6.125 13.43 6 12.725 6 12C6 11.275 6.125 10.57 6.345 9.91V7.06H2.67C1.9 8.59286 1.49932 10.2846 1.5 12C1.5 13.775 1.925 15.455 2.67 16.94L6.345 14.09Z" fill="#FBBC05"/>
            <path d="M12.5 5.375C14.115 5.375 15.565 5.93 16.705 7.02L19.86 3.865C17.955 2.09 15.465 1 12.5 1C8.20001 1 4.48001 3.465 2.67001 7.06L6.34501 9.91C7.21001 7.31 9.63501 5.375 12.5 5.375Z" fill="#EA4335"/>
        </svg>
        <span>Continuar con Google</span>
    </button>
</template>