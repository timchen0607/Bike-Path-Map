import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/scss/_reset.scss";
import "leaflet/dist/leaflet.css";
import "./assets/scss/_global.scss";

createApp(App).use(router).mount("#app");
