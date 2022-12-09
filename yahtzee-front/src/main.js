import { createApp } from "vue";
import { io } from "socket.io-client";
import App from "./App.vue";
import "@rensatsu/blueberry-css/scss/blueberry.scss";

console.log("VITE_BACK_URL", import.meta.env.VITE_BACK_URL);
globalThis.socket = io(import.meta.env.VITE_BACK_URL);

const app = createApp(App);
app.mount("#app");
