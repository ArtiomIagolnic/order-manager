<template>
  <div>
    <NavBar />
    <div class="mx-auto p-8">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow">
        <router-view></router-view>
      </div>
    </div>
    <Notifications />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Notifications from '@/components/Notifications.vue'
export default {
  components: {
    NavBar,
    Notifications
  }
}
</script>


