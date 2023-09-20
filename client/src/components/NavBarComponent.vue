<template >
    <nav class="bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-900">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">

            <router-link :to="{ name: 'home' }">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="dark:text-white w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <span class="ml-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white">

                        Order Manager</span>
                </div>

            </router-link>

            <button data-collapse-toggle="mega-menu-full" type="button" @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mega-menu-full" :aria-expanded="isMobileMenuOpen ? 'true' : 'false'">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15" />
                </svg>
            </button>

            <div id="mega-menu-full" :class="{ 'hidden': !isMobileMenuOpen, 'md:flex': isMobileMenuOpen }"
                class="items-center justify-between font-medium w-full md:flex md:w-auto md:order-1">
                <ul
                    class="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li v-for="link in links">
                        <router-link :to="link.path" @click="closeMobileMenu"
                            :class="{ 'active-link': $route.path === link.path }"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors hover:underline">
                            {{ link.name }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
export default {
    data() {
        return {
            isMobileMenuOpen: false,
            links: [
                { name: 'Home', path: '/' },
                { name: 'Customers', path: '/customers' },
                { name: 'Products', path: '/products' },
                { name: 'Orders', path: '/orders' }
            ],
        }
    },
    methods: {
        closeMobileMenu() {
            this.isMobileMenuOpen = false
        }
    },
}
</script>

<style scoped>
.active-link {
  font-weight: bold;
  color: rgb(45 212 191); 
  text-decoration: none; 
  transition: color 0.3s ease-in-out;
}

.active-link:hover {
  color: rgb(5, 184, 160); /* Darker blue color on hover */
  text-decoration: underline; /* Add underline on hover */
}

/* Add a subtle background color to active links */
.active-link::before {
  content: '';
  display: block;
  height: 2px; /* Underline height */
  width: 0;
  background-color: rgb(45 212 191); /* Same as active link color */
  transition: width 0.3s ease-in-out;
}

.active-link:hover::before {
  width: 100%; /* Full width on hover */
}

/* Add a subtle animation for the underline */
.active-link::before {
  animation: underline-grow 0.3s ease-in-out forwards;
}

@keyframes underline-grow {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>


