import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import "@/assets/index.css";

import App from "./App.vue";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faSortUp,
  faSortDown,
  faSort
} from "@fortawesome/free-solid-svg-icons";

library.add(faSortUp, faSortDown,faSort);
const pinia = createPinia();
const app = createApp(App);

app
  .use(pinia)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
