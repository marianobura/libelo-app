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

const selectedDays = ref([]) // días seleccionados

function toggleDay(day) {
  if (selectedDays.value[0] === day) {
    selectedDays.value = [] // deselecciona si ya está seleccionado
    selectedDays.value == getCalendarEvents() // actualiza los eventos del calendario
  } else {
    selectedDays.value = [day] // reemplaza con el nuevo día
  }
}


onMounted(() => {
    userStore.fetchUser();
});
</script>

<template>
  <BaseBody>
    <BaseNav title="Calendario" />
    <div class="flex flex-col gap-4 p-2 max-w-md mx-auto">
      <SubjectBanner />
      <BaseTitle
        title="Revisa tus próximas fechas"
        description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar."
      >
        <button @click="getCalendarEvents" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Ver eventos de Calendar</button>

        <!-- Cabecera del mes y año -->
        <div class="flex justify-between items-center mb-4">
          <button class="text-gray-500 hover:text-gray-700">&lt;</button>
          <h2 class="text-xl font-semibold">Mayo 2025</h2>
          <button class="text-gray-500 hover:text-gray-700">&gt;</button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 text-center text-gray-600 font-semibold border-b border-gray-300 pb-2 mb-2">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>

        <!-- Números del calendario -->
        <div class="grid grid-cols-7 gap-2 text-center">
          <!-- Espacios vacíos para alinear el primer día -->
          <div></div><div></div><div></div><div></div>

          <!-- Días con toggle -->
          <template v-for="day in 31" :key="day">
            <div
              @click="toggleDay(day)"
              class="cursor-pointer rounded-full w-8 h-8 flex items-center justify-center select-none transition-colors"
              :class="selectedDays.includes(day)
                ? 'bg-blue-600 text-white font-semibold shadow'
                : 'hover:bg-blue-100'"
              >
              {{ day }}
            </div>
          </template>
        </div>

        <div v-if="calendarEvents.length" class="mt-6">
          <h4 class="font-semibold mb-2">📅 Eventos:</h4>
          <ul class="list-disc list-inside text-sm text-gray-700">
            <li v-for="event in calendarEvents" :key="event.id">
              {{ event.summary }} - {{ event.start.dateTime || event.start.date }}
            </li>
          </ul>
        </div>
      </BaseTitle>
    </div>
  </BaseBody>
</template>