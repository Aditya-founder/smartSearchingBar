import { createRouter, createWebHistory } from "vue-router";
import Pages from "../pages/UserLocation.vue";

const routes = [
  {
    path: "/",
    component: Pages,
  },
];

export default createRouter({
  routes,
  history: createWebHistory(),
});
