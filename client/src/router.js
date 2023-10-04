import { createRouter, createWebHistory } from "vue-router";
import HomeComponent from "@/pages/Home.vue";
import CustomerComponent from "@/pages/customers/index.vue";
import ProductComponent from "@/pages/products/index.vue";
import OrderComponent from "@/pages/orders/index.vue";
import ExportComponent from "@/pages/exports/index.vue";
import E404Component from "@/components/E404Component.vue";


const routes = [
  {
    name: "home",
    path: "/",
    component: HomeComponent,
  },
  {
    name: "customers",
    path: "/customers",
    component: CustomerComponent,
  },
  {
    name: "products",
    path: "/products",
    component: ProductComponent,
  },
  {
    name: "orders",
    path: "/orders",
    component: OrderComponent,
  },
  {
    name: "exports",
    path: "/exports",
    component: ExportComponent,
  },
  {
    path: "/:any(.*)",
    component: E404Component,
  },
];

export default createRouter({
  routes,
  history: createWebHistory(),
});
