import { ref, computed } from 'vue';

export function useCalendar() {
    const currentDate = ref(new Date());
    const selectedDays = ref([]);
    const calendarEvents = ref([]);

    const currentMonth = computed(() => currentDate.value.getMonth());
    const currentYear = computed(() => currentDate.value.getFullYear());

    function changeMonth(offset) {
        const newDate = new Date(currentYear.value, currentMonth.value + offset, 1);
        currentDate.value = newDate;
    }

    function toggleDay(day) {
        selectedDays.value = selectedDays.value[0] === day ? [] : [day];
    }

    function selectCurrentDay() {
        const today = new Date();
        selectedDays.value =
            today.getFullYear() === currentYear.value &&
            today.getMonth() === currentMonth.value
                ? [today.getDate()]
                : [];
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

    return {
  currentDate,
  selectedDays,
  calendarEvents,
  changeMonth,
  toggleDay,
  selectCurrentDay,
  isToday,
  getEventsforSelectedDays,
  hasEventOnDay
    };
}