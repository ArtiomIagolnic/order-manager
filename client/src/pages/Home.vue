<template>
  <div>
    <div class="container mx-auto text-center">
      <p class="text-lg md:text-xl">Welcome to order manager</p>
      <div v-if="chartData.labels.length > 0">
        <Line :data="chartData" :options="options" />
      </div>
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
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default {
  components: {
    Line,
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Order total price",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
    };
  },
  async mounted() {
    try {
      const orderStore = useOrderStore();
      const orders = await orderStore.getOrders();
      if (orders) {
        const sortedDates = orders
          .map((order) => new Date(order.date))
          .sort((a, b) => a - b);
        const formattedDatesLabels = sortedDates.map((date) =>
          new Date(date).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
        const orderAmounts = orders.map((order) =>
          parseFloat(order.totalAmount)
        );

        this.chartData.labels = formattedDatesLabels;
        this.chartData.datasets[0].data = orderAmounts;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
</script>
