import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./style.css";
import router from "./router";
import { createPinia } from "pinia";
import "@/services/axios";
import vue3GoogleLogin from "vue3-google-login";

const CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
    clientId: CLIENT_ID,
    scope: "openid email profile calendar.readonly classroom.courses.readonly",
    prompt: "consent",
    loginHint: "",
});

app.mount("#app");
