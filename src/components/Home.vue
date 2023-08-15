<template>
  <div>
    <div class="container mx-auto text-center">
      <p class="text-lg md:text-xl">
        Welcome to customer manager
      </p>
      <Line :data="data" :options="options" />
    </div>
  </div>
</template>
<script>
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
import * as chartConfig from '@/chartConfig.js'

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
    return chartConfig
  }
}
</script>
