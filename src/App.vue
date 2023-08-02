<template>
  <div class="mx-auto flex justify-center items-center mt-8">
    <div class="container mx-auto bg-white p-8 rounded-lg shadow">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800 border-b-2 border-blue-500 pb-3">
        Customer Management
      </h1>
      <nav class="flex justify-center m-4 space-x-4 mb-5">
        <div class="flex-1">

          <router-link :to="{ name: 'customers' }">
            <button class="w-full px-6 py-3 text-white font-semibold rounded bg-blue-500 hover:bg-blue-600">Customers
            </button>
          </router-link>

        </div>
        <div class="flex-1">

          <router-link :to="{ name: 'products' }">
            <button class="w-full px-6 py-3 text-white font-semibold rounded bg-blue-500 hover:bg-blue-600">Products
            </button>
          </router-link>

        </div>

      </nav>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
