<script setup>
import 'flowbite/dist/flowbite.min.js';
import 'flowbite-datepicker';
import { useCalendar } from '@/composables/useCalendar';
import { ref, computed, onMounted, watch } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/Subject/SubjectBanner.vue";
import { useUserStore } from "@/stores/userStore";
import { Trash2, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-vue-next";
import EditModal from "@/components/Calendar/EditModal.vue";
import DeleteEventModal from "@/components/Calendar/DeleteEventModal.vue";
import BaseInput from '@/components/BaseInput.vue';
import CreateEventModal from '@/components/Calendar/CreateEventModal.vue';

const { currentDate, selectedDays, calendarEvents, changeMonth, toggleDay, selectCurrentDay, isToday, hasEventOnDay, getEventsforSelectedDays } = useCalendar();

const userStore = useUserStore();
const showEventModal = ref(false);
const deleteEventModal = ref(false);
const eventToDelete = ref(null);
const selectedEvent = ref(null);
const isEditing = ref(false);
const formattedEditDate = ref("");
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const formattedDate = ref('');

const daysInMonth = computed(() => {
    return Number(new Date(currentYear.value, currentMonth.value + 1, 0).getDate()) || 0;
});

const firstDayOfMonth = computed(() => {
    return Number(new Date(currentYear.value, currentMonth.value, 1).getDay()) || 0;
});

const isCreating = computed(() => showEventModal.value && !selectedEvent.value?.id);
const isEditingEvent = computed(() => showEventModal.value && !!selectedEvent.value?.id);

function formatDateTime(dateObj) {
    if (!dateObj) return '';
    const dateStr = dateObj.dateTime || dateObj.date;
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.toLocaleString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function closeModal() {
    showEventModal.value = false;
    isEditing.value = false;
    selectedEvent.value = null;
    formattedEditDate.value = '';
}

function confirmDelete(event) {
    eventToDelete.value = event;
    deleteEventModal.value = true;
}

function handleUpdate({ event, date }) {
    selectedEvent.value = event;
    formattedEditDate.value = date;
    saveChanges();
}

function handleDelete() {
    eventToDelete.value = selectedEvent.value;
    deleteEventModal.value = true;
}

async function saveChanges() {
    const updatedEvent = {
        summary: selectedEvent.value.summary,
        description: selectedEvent.value.description,
        start: { dateTime: new Date(formattedEditDate.value).toISOString() },
        end: { dateTime: new Date(new Date(formattedEditDate.value).getTime() + 60 * 60 * 1000).toISOString() }
    };

    if (!selectedEvent.value.id) {
        await addEvent(updatedEvent);
        closeModal();
    } else {
        await editEvent(selectedEvent.value.id, updatedEvent);
    }

    isEditing.value = false;
    await getCalendarEvents();
}

function openEventModal(event) {
    selectedEvent.value = event;
    showEventModal.value = true;
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

async function deleteConfirmedEvent() {
    if (!eventToDelete.value) return;

    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventToDelete.value.id}`;
        await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            }
        });

        calendarEvents.value = calendarEvents.value.filter(event => event.id !== eventToDelete.value.id);
        deleteEventModal.value = false;
        eventToDelete.value = null;
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

async function addEvent(event) {
    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            },
            body: JSON.stringify(event)
        });

        if (!response.ok) {
            throw new Error("Error al agregar el evento");
        }

        const newEvent = await response.json();
        calendarEvents.value.push(newEvent);
    } catch (error) {
        console.error("Error al agregar el evento:", error);
    }
}

function openNewEventModal() {
    const selectedDay = selectedDays.value[0];
    if (!selectedDay) return;

    const startDate = new Date(currentYear.value, currentMonth.value, selectedDay, 12);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    selectedEvent.value = {
        summary: "Nuevo evento",
        description: "",
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() }
    };

    formattedEditDate.value = startDate.toISOString().slice(0, 16);
    isEditing.value = true;
    showEventModal.value = true;
}

function handleCreate({ event, date }) {
    selectedEvent.value = event;
    formattedEditDate.value = date;
    saveChanges();
}

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
            currentDate.value = date;
        }
    }
}

const selectedDateLabel = computed(() => {
    if (!selectedDays.value.length) return '';

    const day = selectedDays.value[0];
    const date = new Date(currentYear.value, currentMonth.value, day);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
});

onMounted(async () => {
    await userStore.fetchUser();
    await getCalendarEvents();
    await selectCurrentDay();
});

watch(() => selectedEvent.value, (event) => {
    if (event?.start?.dateTime) {
        const date = new Date(event.start.dateTime);
        formattedEditDate.value = date.toISOString().slice(0, 16);
    }
});

watch(currentDate, () => {
    getCalendarEvents();
    selectCurrentDay();
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Calendario" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Revisa tus próximas fechas"
                description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar.">
                <div class="flex gap-2">
                    <BaseInput calendar v-model="formattedDate" identifier="custom-datepicker" placeholder="dd/mm/aaaa" @input="formatDateInput" />
                    <button @click="openNewEventModal" class="flex items-center justify-center bg-libelo-500 rounded-xl text-white size-11 shrink-0">
                        <CalendarPlus :size="20" />
                    </button>
                </div>
                <div class="flex justify-between items-center p-2 bg-white rounded-xl">
                    <button @click="changeMonth(-1)" class="size-8 flex items-center justify-center rounded-xl hover:bg-neutral-200">
                        <ChevronLeft />
                    </button>
                    <h2 class="text-xl font-semibold">{{ currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric"}) }}</h2>
                    <button @click="changeMonth(1)" class="size-8 flex items-center justify-center rounded-xl hover:bg-neutral-200">
                        <ChevronRight />
                    </button>
                </div>

                <div class="grid grid-cols-7 text-center font-semibold border-b border-gray-300 pb-2 mb-2">
                    <div>Dom</div>
                    <div>Lun</div>
                    <div>Mar</div>
                    <div>Mié</div>
                    <div>Jue</div>
                    <div>Vie</div>
                    <div>Sáb</div>
                </div>

                <div class="grid grid-cols-7 gap-2 text-center justify-items-center border-b border-gray-300 pb-2">
                    <div v-for="n in firstDayOfMonth" :key="'blank-' + n"></div>
                    <div v-for="day in daysInMonth" :key="day" @click="toggleDay(day)" class="cursor-pointer relative rounded-full size-8 flex items-center justify-center select-none transition-colors" :class="[ selectedDays.includes(day) ? 'bg-libelo-500 text-white font-semibold shadow' : isToday(day) ? 'text-libelo-500 font-bold' : 'hover:bg-libelo-100']">{{ day }}<span v-if="hasEventOnDay(day) && !selectedDays.includes(day)" class="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-libelo-500 focus:text-white"></span>
                    </div>
                </div>
                <BaseTitle v-if="getEventsforSelectedDays().length" :title="`Eventos para el día ${selectedDateLabel}`">
                    <template v-if="calendarEvents.length">
                        <div v-for="event in getEventsforSelectedDays()" :key="event.id" @click="openEventModal(event)" class="p-2 flex justify-between items-center text-white bg-libelo-500 hover:bg-libelo-600 rounded-xl overflow-hidden">
                            <div class="flex flex-col overflow-hidden pl-1">
                                <span class="text-xs whitespace-nowrap">{{ formatDateTime(event.start) }} - {{ formatDateTime(event.end) }}</span>
                                <span class="font-semibold line-clamp-1 break-all">{{ event.summary }}</span>
                            </div>
                            <button class="size-11 flex items-center justify-center hover:bg-libelo-600 rounded-lg shrink-0" @click.stop="confirmDelete(event)">
                                <Trash2 :size="20" />
                            </button>
                        </div>
                    </template>
                </BaseTitle>
            </BaseTitle>
        </div>

        <EditModal v-if="isEditingEvent" :show="showEventModal" :event="selectedEvent" :isEditing="isEditing" :date="formattedEditDate" @close="showEventModal = false" @update="handleUpdate" @delete="handleDelete" />
        <CreateEventModal v-else-if="isCreating" :show="showEventModal" :event="selectedEvent" :date="formattedEditDate" @close="showEventModal = false" @confirm="handleCreate" />
        <DeleteEventModal :show="deleteEventModal" :event="eventToDelete" @close="deleteEventModal = false" @confirm="deleteConfirmedEvent" />
    </BaseBody>
</template>