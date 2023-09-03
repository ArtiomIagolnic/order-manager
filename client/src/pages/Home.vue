<template>
  <div>
    <div class="container mx-auto text-center">
      <p class="text-lg md:text-xl">
        Welcome to customer manager
      </p>
      <Line :data="chartData" :options="options" />
    </div>
  </div>
</template>
<script>
import { useOrderStore } from "@/store/order";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
export default {
  components: {
    Line
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    }
  },
  computed: {
    chartData() {
      try {
        const orderStore = useOrderStore();
        const orders = orderStore.getOrders()
        if (orders) {
          const sortedDates = orders.map((order) => new Date(order.date)).sort((a, b) => a - b)
          const formattedDatesLabels = sortedDates.map((date) => new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }))
          const orderAmounts = orders.map((order) => order.totalAmount)
          return {
            labels: formattedDatesLabels,
            datasets: [
              {
                label: "Order total price",
                backgroundColor: "#f87979",
                data: orderAmounts,
              },
            ]
          }
        } else {
          return { labels: [], datasets: [] }
        }
      } catch (error) {
        console.error("Error fetching orders data", error);
      }
    }
  }
}
</script>
