<script setup>
import { onMounted, ref } from "vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';

const calendarUrl = ref("");
const userSubjects = ref([]);
const isAuthenticated = ref(false);
let authInstance;

const fetchUserSubjects = async () => {
  try {
    const response = await fetch("/api/user/subjects");
    userSubjects.value = await response.json();
    fetchCalendar(); 
  } catch (error) {
    console.error("Error al obtener las materias del usuario:", error);
  }
};

const fetchCalendar = async () => {
  try {
    const response = await window.gapi.client.calendar.calendarList.list();
    const calendars = response.result.items;

    const userCalendar = calendars.find(calendar => 
      userSubjects.value.some(subject => subject.calendarId === calendar.id)
    );

    if (userCalendar) {
      calendarUrl.value = `http://calendar.google.com/calendar/embed?src=${userCalendar.id}`;
    } else {
      console.error("No se encontraron calendarios relacionados con las materias del usuario.");
    }
  } catch (error) {
    console.error("Error al obtener el calendario:", error);
  }
};

const signOut = async () => {
  try {
    await authInstance.value.signOut();
    isAuthenticated.value = false;
    calendarUrl.value = "";
    userSubjects.value = [];
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const initGoogleAPI = () => {
  if (window.gapi) {
    window.gapi.load("client:auth2", () => {
      window.gapi.auth2.init({
        client_id: "39835059225-lfbhq2998imrbdm5m9out87hprs0mkj6.apps.googleusercontent.com",
      }).then(() => {
        authInstance = window.gapi.auth2.getAuthInstance();
        isAuthenticated.value = authInstance.isSignedIn.get();
        if (isAuthenticated.value) {
          fetchUserSubjects();
        }
      }).catch(error => {
        console.error("Error al inicializar la API de Google: ", error);
      });
    });
  } else {
    console.error("La librería de Google API no está disponible.");
  }
};

onMounted(() => {
  initGoogleAPI();
});
</script>

<template>
  <BaseBody>
    <BaseNav title="Calendario" />
    <div class="flex flex-col gap-4 p-2">
      <SubjectBanner />
      <BaseTitle title="Revisa tus próximas fechas" description="Consulta y organiza tu tiempo desde acá.">
        <div v-if="isAuthenticated" class="w-full bg-[#F0F0F0] p-2 rounded-lg overflow-hidden">
          <iframe v-if="calendarUrl" class="w-full border-none rounded-lg" :src="calendarUrl" frameborder="0" scrolling="no"></iframe>
          <button @click="signOut" class="bg-red-500 text-white p-2 rounded mt-2">Cerrar sesión</button>
        </div>
        <div v-else class="text-center">
          <p>No has iniciado sesión.</p>
          <GoogleLogin />
        </div>
      </BaseTitle>
    </div>
  </BaseBody>
</template>
