<template>
  <div>
    <div class="container mx-auto text-center">   
      <p class="text-lg md:text-xl">
        Welcome to customer manager
      </p>
      <router-link :to="{name:'customers'}">
    <button  class="mt-8 bg-white text-indigo-500 py-2 px-6 rounded-lg inline-block font-semibold hover:bg-indigo-600 hover:text-white">Get Started</button>
    </router-link>
    </div>
  </div>
</template>
<script>
export default {};
</script>
