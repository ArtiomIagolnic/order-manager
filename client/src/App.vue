<template>
  <div>
    <NavBarComponent />
    <div class="md:w-full pt-4">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow">
        <router-view />
      </div>
    </div>
    <NotificationsComponent />
    <FooterComponent />
  </div>
</template>

<script>
import NavBarComponent from "@/components/NavBarComponent.vue";
import NotificationsComponent from "@/components/NotificationsComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
export default {
  components: {
    NavBarComponent,
    NotificationsComponent,
    FooterComponent,
  },
};
</script>
