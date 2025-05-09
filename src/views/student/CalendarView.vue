<script setup>
import { ref, onMounted } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from '@/components/BaseTitle.vue';
import SubjectBanner from '@/components/SubjectBanner.vue';
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const calendarEvents = ref([])

const getCalendarEvents = async () => {
    try {
        const now = new Date()
        const isoDate = now.toISOString()

        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(isoDate)}`

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            }
        })

        const data = await res.json()
        calendarEvents.value = data.items || []
        console.log('📅 Eventos desde ahora:', data)
    } catch (err) {
        console.error('Error al obtener eventos:', err)
    }
}

const courses = ref([])
const getClassroomCourses = async () => {
    try {
        const res = await fetch('https://classroom.googleapis.com/v1/courses', {
            headers: {
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            }
        })
        const data = await res.json()
        courses.value = data.courses || []
        console.log('🏫 Cursos de Classroom:', data)
    } catch (err) {
        console.error('Error al obtener cursos:', err)
    }
}

onMounted(() => {
    userStore.fetchUser();
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Calendario" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Revisa tus próximas fechas" description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar.">
                <button @click="getCalendarEvents">Ver eventos de Calendar</button>
                <button @click="getClassroomCourses">Ver cursos de Classroom</button>

                <div v-if="calendarEvents.length">
                    <h4>📅 Eventos:</h4>
                    <ul>
                        <li v-for="event in calendarEvents" :key="event.id">{{ event.summary }} - {{ event.start.dateTime || event.start.date }}</li>
                    </ul>
                </div>

                <div v-if="courses.length">
                    <h4>🏫 Cursos:</h4>
                    <ul>
                        <li v-for="course in courses" :key="course.id">{{ course.name }}</li>
                    </ul>
                </div>
            </BaseTitle>
        </div> 
    </BaseBody>
</template>