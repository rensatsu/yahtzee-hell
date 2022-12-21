import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";
import "./app.scss";
// import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const pinia = createPinia();
const app = createApp(App);

library.add(faCopy);

app.use(pinia);
app.component("fa-icon", FontAwesomeIcon);
app.mount("#app");
