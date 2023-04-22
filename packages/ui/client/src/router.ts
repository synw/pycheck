import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import HomeView from "./views/HomeView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomeView,
    meta: {
      title: "Home"
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
