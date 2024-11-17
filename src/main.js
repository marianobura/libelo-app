import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./style.css";
import router from "./router";
import { createPinia } from "pinia";
import "../src/services/axios";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");
