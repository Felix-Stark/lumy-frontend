<!-- src/components/BarChart.vue -->
<template>
	<div class="w-full h-80">
	  <Bar :data="chartData" :options="chartOptions" />
	</div>
  </template>
  
  <script setup lang="ts">
  import { Bar } from 'vue-chartjs'
  import type { ChartData, ChartOptions } from 'chart.js'
  
  const chartData: ChartData<'bar'> = {
	labels: ['January', 'February', 'March'],
	datasets: [
	  {
		label: 'Sales',
		data: [100, 200, 150],
		backgroundColor: '#2563eb',
	  },
	],
  }
  
  const chartOptions: ChartOptions<'bar'> = {
	responsive: true,
	plugins: {
	  legend: {
		position: 'top',
	  },
	  title: {
		display: true,
		text: 'Monthly Sales',
	  },
	},
  }
  </script>
  