<script setup>
import { useCalendar } from '@/composables/useCalendar';
import { ref, computed, onMounted, watch } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { useUserStore } from "@/stores/userStore";
import { Trash2, Plus } from "lucide-vue-next";
import CalendarInputSearch from "@/components/Calendar/CalendarInputSearch.vue";
import EditModal from "@/components/Calendar/EditModal.vue";
import DeleteEventModal from "@/components/Calendar/DeleteEventModal.vue";

const {
  currentDate,
  selectedDays,
  calendarEvents,
  changeMonth,
  toggleDay,
  selectCurrentDay,
  isToday,
  hasEventOnDay,
  getEventsforSelectedDays
} = useCalendar();

const userStore = useUserStore();
const showEventModal = ref(false);
const deleteEventModal = ref(false);
const eventToDelete = ref(null);
const selectedEvent = ref(null);
const isEditing = ref(false);
const formattedEditDate = ref("");
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

const daysInMonth = computed(() => {
    return Number(new Date(currentYear.value, currentMonth.value + 1, 0).getDate()) || 0;
});

const firstDayOfMonth = computed(() => {
    return Number(new Date(currentYear.value, currentMonth.value, 1).getDay()) || 0;
});


// Formatea la fecha y hora de un objeto Date o de un objeto con propiedades dateTime o date
function formatDateTime(dateObj) {
  if (!dateObj) return '';
  const dateStr = dateObj.dateTime || dateObj.date;
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Confirma la eliminación de un evento con un modal
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

// Guarda los cambios realizados en el evento
async function saveChanges() {
  const updatedEvent = {
    summary: selectedEvent.value.summary,
    description: selectedEvent.value.description,
    start: { dateTime: new Date(formattedEditDate.value).toISOString() },
    end: { dateTime: new Date(new Date(formattedEditDate.value).getTime() + 60 * 60 * 1000).toISOString() }
  };
  
  if (!selectedEvent.value.id) {
    await addEvent(updatedEvent);
  } else {
    await editEvent(selectedEvent.value.id, updatedEvent);
  }
  
  isEditing.value = false;
  showEventModal.value = false;
  await getCalendarEvents();
}

function openEventModal(event) {
  selectedEvent.value = event;
  showEventModal.value = true;
}

// fetch a la api para trar eventos del calendario
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
      
      
      // Elimina evento confirmado
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

// Edita un evento específico
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


// Agrega un nuevo evento al calendario
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

// Abre el modal para crear un nuevo evento
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

// Corta el texto de los eventos si es demasiado largo
const cutEvents = (text, maxLength = 16) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 3) + '...';
  }
  return text;
};

onMounted(async () => {
  await userStore.fetchUser();
  await getCalendarEvents();
  await selectCurrentDay();
});

// Llena el input del modal con la fecha exacta
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

                <CalendarInputSearch @select-date="currentDate = new Date($event)" />

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
                                    ? 'text-libelo-500 font-bold'
                                    : 'hover:bg-libelo-100']">
                        {{ day }}
                        <span v-if="hasEventOnDay(day) && !selectedDays.includes(day)" class="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-libelo-500 focus:text-white"></span>
                    </div>
                </div>

                <div v-if="calendarEvents.length" class="mt-6 bg-libelo-700 rounded-md">
                    <ul class="list-disc list-inside text-sm text-gray-700">
                        <li v-for="event in getEventsforSelectedDays()" :key="event.id" @click="openEventModal(event)" class="border border-white text-white px-3 py-2 list-none flex flex-wrap gap-x-2 gap-y-1 items-center hover:bg-libelo-600">
                        <div class="flex-1 truncate" :title="event.summary">
                            <span class="font-semibold">{{ cutEvents(event.summary, 20) }}</span>
                        </div>
                        <div class="text-xs whitespace-nowrap mr-10">
                            {{ formatDateTime(event.start) }}
                        </div>
                        <button @click.stop="confirmDelete(event)">
                            <Trash2 :size="20" />
                        </button>
                        </li>
                    </ul>
                </div>
            </BaseTitle>
        </div>

        <button v-if="selectedDays.length > 0" id="show-modal" @click="openNewEventModal" class="fixed bottom-20 right-0 size-12 flex items-center justify-center bg-libelo-500 rounded-full mr-2 mb-2 text-white">
        <Plus :size="24" />
        </button>

       <EditModal
  :show="showEventModal"
  :event="selectedEvent"
  :isEditing="isEditing"
  :date="formattedEditDate"
  @close="showEventModal = false"
  @update="handleUpdate"
  @delete="handleDelete"
/>
        
<DeleteEventModal
  :show="deleteEventModal"
  :event="eventToDelete"
  @close="deleteEventModal = false"
  @confirm="deleteConfirmedEvent"
/>

    </BaseBody>
</template>