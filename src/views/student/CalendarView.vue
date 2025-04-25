<script setup>
import { ref, onMounted } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from '@/components/BaseTitle.vue';
import SubjectBanner from '@/components/SubjectBanner.vue';
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const calendarUrl = ref("");

async function verifyToken() {
    try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${userStore.user.google.accessToken}`);
        const data = await response.json();
        console.log("Token Info:", data);
    } catch (error) {
        console.error("Error verificando token:", error);
    }
}
verifyToken();

async function fetchUserCalendar() {
    try {
        const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
            headers: {
                Authorization: `Bearer ${userStore.user.google.accessToken}`
            }
        });

        const data = await response.json();
        console.log("Calendario:", data);

        if (data.items && data.items.length > 0) {
            const userCalendarId = data.items[0].id;  
            calendarUrl.value = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userCalendarId)}`;
        }
    } catch (error) {
        console.error("Error obteniendo el calendario:", error);
    }
}

onMounted(() => {
    userStore.fetchUser();
    fetchUserCalendar();
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Calendario" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Revisa tus próximas fechas" description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar.">
                <iframe 
                    :src="calendarUrl"
                    style="border: 0" 
                    width="auto" 
                    height="400" 
                    frameborder="0" 
                    scrolling="no">
                </iframe>
            </BaseTitle>
        </div> 
    </BaseBody>
</template>