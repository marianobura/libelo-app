<script setup>
import 'flowbite/dist/flowbite.min.js';
import 'flowbite-datepicker';

import { ref, computed, onMounted, watch } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { useUserStore } from "@/stores/userStore";
import { Trash2, Pencil, Check } from "lucide-vue-next";
import BaseModal from "@/components/BaseModal.vue";

const userStore = useUserStore();
const calendarEvents = ref([]);
const selectedDays = ref([]);
const currentDate = ref(new Date());
const showEventModal = ref(false);
const selectedEvent = ref(null);
const isEditing = ref(false);
const formattedEditDate = ref("");

watch(() => selectedEvent.value, (event) => {
  if (event?.start?.dateTime) {
    const date = new Date(event.start.dateTime);
    formattedEditDate.value = date.toISOString().slice(0, 16);
  }
});

async function saveChanges() {
  const updatedEvent = {
    summary: selectedEvent.value.summary,
    description: selectedEvent.value.description,
    start: { dateTime: new Date(formattedEditDate.value).toISOString() },
    end: { dateTime: new Date(new Date(formattedEditDate.value).getTime() + 60 * 60 * 1000).toISOString() }
  };
  await editEvent(selectedEvent.value.id, updatedEvent);
  isEditing.value = false;
  showEventModal.value = false;
  await getCalendarEvents();
}

function openEventModal(event) {
  selectedEvent.value = event;
  showEventModal.value = true;
}

const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

const daysInMonth = computed(() => {
    return Number(new Date(currentYear.value, currentMonth.value + 1, 0).getDate()) || 0;
});

const firstDayOfMonth = computed(() => {
    return Number(new Date(currentYear.value, currentMonth.value, 1).getDay()) || 0;
});

const formattedDate = ref('');

function formatDateInput(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);

  if (value.length >= 5) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
  } else if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  formattedDate.value = value;

  if (value.length === 10) {
    const [dd, mm, yyyy] = value.split('/');
    const date = new Date(+yyyy, +mm - 1, +dd);
    if (!isNaN(date)) {
      currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
      selectedDays.value = [date.getDate()];
    }
  }
}

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

function selectCurrentDay() {
    const today = new Date();
    if (today.getFullYear() === currentYear.value && today.getMonth() === currentMonth.value) {
        selectedDays.value = [today.getDate()];
    } else {
        selectedDays.value = [];
    }
}

function isToday(day) {
    const today = new Date();
    return (
        today.getFullYear() === currentYear.value &&
        today.getMonth() === currentMonth.value &&
        today.getDate() === day
    );
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

function hasEventOnDay(day) {
    return calendarEvents.value.some(event => {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        return (
            eventDate.getFullYear() === currentYear.value &&
            eventDate.getMonth() === currentMonth.value &&
            eventDate.getDate() === day
        );
    });
}

async function deleteEvent(eventId) {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore?.user.google.accessToken}`
      }
    });

    calendarEvents.value = calendarEvents.value.filter(event => event.id !== eventId);
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
  }
}

async function editEvent(eventId, updatedEvent) {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore?.user.google.accessToken}`
      },
      body: JSON.stringify(updatedEvent)
    });

    if (!response.ok) {
      throw new Error("Error al editar el evento");
    }

    const index = calendarEvents.value.findIndex(event => event.id === eventId);
    if (index !== -1) {
      calendarEvents.value[index] = { ...calendarEvents.value[index], ...updatedEvent };
    }
  } catch (error) {
    console.error("Error al editar el evento:", error);
  }
}

onMounted(async () => {
    await userStore.fetchUser();
    await getCalendarEvents();
    await selectCurrentDay();
});

watch(currentDate, getCalendarEvents);
</script>

<template>
    <BaseBody>
        <BaseNav title="Calendario" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Revisa tus próximas fechas"
                description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar.">

                <div class="relative mt-3">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-libelo-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                    <input id="custom-datepicker" type="text" v-model="formattedDate" @input="formatDateInput" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-libelo-500 focus:border-libelo-500 block w-full ps-10 p-2.5" placeholder="dd/mm/aaaa"/>
                </div>

                <div class="flex justify-between items-center mb-4 mt-10">
                    <button @click="changeMonth(-1)" class="text-gray-500 hover:text-gray-700">&lt;</button>
                    <h2 class="text-xl font-semibold">
                        {{ currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" }) }}
                    </h2>
                    <button @click="changeMonth(1)" class="text-gray-500 hover:text-gray-700">&gt;</button>
                </div>

                <div
                    class="grid grid-cols-7 text-center text-gray-600 font-semibold border-b border-gray-300 pb-2 mb-2">
                    <div>Dom</div>
                    <div>Lun</div>
                    <div>Mar</div>
                    <div>Mié</div>
                    <div>Jue</div>
                    <div>Vie</div>
                    <div>Sáb</div>
                </div>

                <div class="grid grid-cols-7 gap-2 text-center justify-items-center">
                    <div v-for="n in firstDayOfMonth" :key="'blank-' + n"></div>
                    <div v-for="day in daysInMonth" :key="day" @click="toggleDay(day)"
                        class="cursor-pointer relative rounded-full size-8 flex items-center justify-center select-none transition-colors"
                        :class="[
                            selectedDays.includes(day)
                                ? 'bg-libelo-500 text-white font-semibold shadow'
                                : isToday(day)
                                    ? 'text-libelo-500 font-semibold'
                                    : 'hover:bg-libelo-100']">
                        {{ day }}
                        <span v-if="hasEventOnDay(day) && !selectedDays.includes(day)" class="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-libelo-500 focus:text-white"></span>
                    </div>
                </div>

                <div v-if="calendarEvents.length" class="mt-6 bg-libelo-700 rounded-md">
                    <ul class="list-disc list-inside text-sm text-gray-700">
                        <li v-for="event in getEventsforSelectedDays()" :key="event.id" @click="openEventModal(event)"
                            class="border border-white text-white px-3 pt-4 pb-4 list-none justify-between flex items-center gap-2 hover:bg-libelo-600">
                            {{ event.summary }} - {{ event.start.dateTime || event.start.date || event.end.date }} 
                            <span @click.stop="deleteEvent(event.id)"><Trash2 /></span>
                        </li>
                    </ul>
                </div>
            </BaseTitle>
        </div>

         <BaseModal v-if="showEventModal" class="items-center justify-center">
            <div class="bg-white p-4 rounded-xl max-w-md w-full mx-2">
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-around mb-2">
                        <span v-if="!isEditing" @click="isEditing = true"><Pencil /></span>
                        <span v-else @click="saveChanges"><Check /></span>

                        <span @click.stop="deleteEvent(selectedEvent.id)"><Trash2 /></span>
                    </div>
                    <div v-if="isEditing">
                    <input v-model="selectedEvent.summary" class="border rounded px-2 py-1 w-full" />
                    </div>
                    <div v-else>
                    <h3 class="text-lg font-bold">{{ selectedEvent?.summary }}</h3>
                    </div>
                    <div v-if="isEditing">
                    <input type="datetime-local" v-model="formattedEditDate" class="border rounded px-2 py-1 w-full" />
                    </div>
                    <div v-else>
                    <p class="text-sm text-neutral-700">
                        <strong>Fecha:</strong> {{ new Date(selectedEvent.start.dateTime).toLocaleString("es-AR") }}
                    </p>
                    </div>
                    <div v-if="isEditing">
                    <textarea v-model="selectedEvent.description" class="border rounded px-2 py-1 w-full" rows="3" />
                    </div>
                    <div v-else>
                    <p class="text-sm text-neutral-700"><strong>Descripción:</strong> {{ selectedEvent.description }}</p>
                    </div>
                    <div class="flex justify-end mt-4">
                        <BaseButton @click="showEventModal = false" secondary>Cerrar</BaseButton>
                    </div>
                </div>
            </div>
        </BaseModal>
    </BaseBody>
</template>