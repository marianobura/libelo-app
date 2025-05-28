<script setup>
import 'flowbite/dist/flowbite.min.js';
import 'flowbite-datepicker';

import { ref, computed, onMounted, watch } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const calendarEvents = ref([]);
const selectedDays = ref([]);
const currentDate = ref(new Date());

const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

function changeMonth(offset) {
  const newDate = new Date(currentYear.value, currentMonth.value + offset, 1);
  currentDate.value = newDate;
}

function toggleDay(day) {
  if (selectedDays.value[0] === day) {
    selectedDays.value = [];
  } else {
    selectedDays.value = [day];
  }
}

function getEventsforSelectedDays() {
  if (selectedDays.value.length === 0) return [];

  return calendarEvents.value.filter(event => {
    const eventDate = new Date(event.start.dateTime || event.start.date);
    return (
      eventDate.getFullYear() === currentYear.value &&
      eventDate.getMonth() === currentMonth.value &&
      selectedDays.value.includes(eventDate.getDate())
    );
  });
}

async function getCalendarEvents() {
  try {
    const start = new Date(currentYear.value, currentMonth.value, 1).toISOString();
    const end = new Date(currentYear.value, currentMonth.value + 1, 0, 23, 59, 59).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(start)}&timeMax=${encodeURIComponent(end)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userStore?.user.google.accessToken}`
      }
    });

    const data = await res.json();
    calendarEvents.value = data.items || [];
  } catch (err) {
    console.error("Error al obtener eventos:", err);
  }
}

onMounted(async () => {
  await userStore.fetchUser();
  await getCalendarEvents();
});

// Re-fetch when date changes
watch(currentDate, getCalendarEvents);
</script>

<template>
  <BaseBody>
    <BaseNav title="Calendario" />
    <div class="flex flex-col gap-4 p-2 max-w-md mx-auto">
      <SubjectBanner />
      <BaseTitle
        title="Revisa tus próximas fechas"
        description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar.">

        <div class="relative max-w-sm">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input datepicker id="default-datepicker" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date">
        </div>

        <!-- Cabecera del mes y año -->
        <div class="flex justify-between items-center mb-4">
          <button @click="changeMonth(-1)" class="text-gray-500 hover:text-gray-700">&lt;</button>
          <h2 class="text-xl font-semibold">
            {{ currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" }) }}
          </h2>
          <button @click="changeMonth(1)" class="text-gray-500 hover:text-gray-700">&gt;</button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 text-center text-gray-600 font-semibold border-b border-gray-300 pb-2 mb-2">
          <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
        </div>

        <!-- Calendario dinámico -->
        <div class="grid grid-cols-7 gap-2 text-center">
          <div v-for="n in firstDayOfMonth" :key="'blank-' + n"></div>
          <div
            v-for="day in daysInMonth"
            :key="day"
            @click="toggleDay(day)"
            class="cursor-pointer rounded-full w-8 h-8 flex items-center justify-center select-none transition-colors"
            :class="selectedDays.includes(day) ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-blue-100'"
          >
            {{ day }}
          </div>
        </div>

        <div v-if="calendarEvents.length" class="mt-6 bg-gray-800 rounded-md">
          <ul class="list-disc list-inside text-sm text-gray-700">
            <li v-for="event in getEventsforSelectedDays()" :key="event.id" class="border border-white text-white px-3 pt-4 pb-4">
              {{ event.summary }} - {{ event.start.dateTime || event.start.date }}
            </li>
          </ul>
        </div>
      </BaseTitle>
    </div>
  </BaseBody>
</template>
