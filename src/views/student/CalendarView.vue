<script setup>
import { onMounted, ref } from "vue";
import { loadGapi } from "gapi-script";
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";

// Configuración de la API de Google
const CLIENT_ID = "TU_CLIENT_ID.apps.googleusercontent.com";
const API_KEY = "AIzaSyDt6k26D7J2za3E1v1imf-wzDLJunN7WgA";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// Estado
const authInstance = ref(null);
const isAuthenticated = ref(false);
const calendarUrl = ref("");

// Función para inicializar Google API
const initClient = async () => {
  try {
    await window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });

    authInstance.value = window.gapi.auth2.getAuthInstance();
    isAuthenticated.value = authInstance.value.isSignedIn.get();

    if (isAuthenticated.value) {
      fetchCalendar();
    }
  } catch (error) {
    console.error("Error al inicializar Google API:", error);
  }
};

// Cargar Google API al montar el componente
onMounted(async () => {
  await loadGapi();
  window.gapi.load("client:auth2", initClient);
});

// Iniciar sesión con Google
const signIn = async () => {
  try {
    await authInstance.value.signIn();
    isAuthenticated.value = true;
    fetchCalendar();
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};

// Obtener el calendario del usuario autenticado
const fetchCalendar = async () => {
  try {
    const response = await window.gapi.client.calendar.calendarList.list();
    const calendars = response.result.items;

    if (calendars.length > 0) {
      calendarUrl.value = `https://calendar.google.com/calendar/embed?src=${calendars[0].id}`;
    }
  } catch (error) {
    console.error("Error al obtener el calendario:", error);
  }
};

// Cerrar sesión
const signOut = async () => {
  try {
    await authInstance.value.signOut();
    isAuthenticated.value = false;
    calendarUrl.value = "";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
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
          <button @click="signIn" class="bg-blue-500 text-white p-2 rounded">Iniciar sesión con Google</button>
        </div>
      </BaseTitle>
    </div>
  </BaseBody>
</template>
