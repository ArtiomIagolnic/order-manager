import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./pages/Home.vue"),
  },
  {
    name: "customers",
    path: "/customers",
    component: () =>
      import(/* webpackChunkName: "customers" */ "./pages/customers/index.vue"),
  },
  {
    name: "products",
    path: "/products",
    component: () =>
      import(/* webpackChunkName: "products" */ "./pages/products/index.vue"),
  },
  {
    name: "orders",
    path: "/orders",
    component: () =>
      import(/* webpackChunkName: "orders" */ "./pages/orders/index.vue"),
  },
  {
    path: "/:any(.*)",
    component: () => import(/* webpackChunkName: ""*/ "./components/E404.vue"),
  },
];

export default createRouter({
  routes,
  history: createWebHistory(),
});
