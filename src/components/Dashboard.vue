<template>
  <div class="w-full max-w-4xl p-6 mx-auto bg-[#0b0e14] border border-slate-800 rounded-xl shadow-2xl">

    <div class="flex flex-col">
      <h2 class="mb-4 text-xl font-semibold text-center text-slate-200">
        Users who have spent the most money
      </h2>

      <div class="w-full h-80 lg:h-96">
        <v-chart :option="chartTopUsers" autoresize />
      </div>

      <h2 class="mb-4 text-xl font-semibold text-center text-slate-200">
        Monthly Sales
      </h2>
      <div class="w-full h-80">
        <v-chart :option="chartMonthlySales" autoresize />
      </div>

      <div class="flex flex-row gap-6 w-full p-4 bg-[#0b0e14]">

        <div class="flex-1 flex flex-col">
          <h2 class="mb-4 text-xl font-semibold text-slate-200">
            Total Users
          </h2>
          <div class="w-full h-80">
            <v-chart :option="chartTotalUsers" autoresize />
          </div>
        </div>

        <div class="flex-1 flex flex-col">
          <h2 class="mb-4 text-xl font-semibold text-slate-200">
            Total Sales
          </h2>
          <div class="w-full h-80">
            <v-chart :option="chartTotalOrders" autoresize />
          </div>
        </div>

      </div>
    </div>

  </div>
    
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import ApiDashboardService from '@/shared/services/ApiDashboardService';
import { UserTop } from '@/shared/models/UserTop';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';


use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, BarChart, GridComponent]);

provide(THEME_KEY, 'dark');

const chartMonthlySales = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' } // Resalta la columna al pasar el mouse
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: { alignWithLabel: true }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: { color: '#1e293b' } // Color de las líneas de fondo (slate-800)
    }
  },
  series: [
    {
      name: 'Ventas',
      type: 'bar',
      barWidth: '60%',
      data: [],
      itemStyle: {
        // Color principal con bordes redondeados superiores
        color: '#4f46e5', 
        borderRadius: [4, 4, 0, 0]
      },
      // Efecto al pasar el mouse
      emphasis: {
        itemStyle: { color: '#6366f1' }
      }
    }
  ]
});

const chartTopUsers = ref({
  backgroundColor: 'transparent', // Crucial para que se vea el fondo de Tailwind
  tooltip: {
    trigger: 'item',
    backgroundColor: '#1e293b', // slate-800
    borderColor: '#334155',     // slate-700
    borderWidth: 1,
    textStyle: { color: '#f1f5f9' },
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: { color: '#94a3b8' } // slate-400
  },
  // Colores extraídos de la paleta de la imagen
  color: ['#4f46e5', '#a3e635', '#475569', '#f97316', '#0ea5e9'],
  series: [
    {
      name: 'Sales',
      type: 'pie',
      radius: ['0%', '70%'], // Si quieres estilo doughnut cambia el 0% por 40%
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0b0e14',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#cbd5e1', // slate-300
        formatter: '{b}'
      },
      labelLine: {
        lineStyle: { color: '#475569' } // slate-600
      },
      data: []
    }
  ]
});

const chartTotalOrders = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: '65%',
      data: [],
      // CONFIGURACIÓN DE LAS ETIQUETAS
      label: {
        show: true,
        position: 'outside', // u 'inside' para que el valor esté dentro
        formatter: '{c}',    // <--- AQUÍ: Solo muestra el valor numérico
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f1f5f9'
      },
      labelLine: {
        lineStyle: { color: '#475569' }
      }
    }
  ]
});

const chartTotalUsers = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: '65%',
      data: [],
      // CONFIGURACIÓN DE LAS ETIQUETAS
      label: {
        show: true,
        position: 'outside', // u 'inside' para que el valor esté dentro
        formatter: '{c}',    // <--- AQUÍ: Solo muestra el valor numérico
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f1f5f9'
      },
      labelLine: {
        lineStyle: { color: '#475569' }
      }
    }
  ]
});

const loading = ref(false);
const error = ref(null);
const getTotalOrders = async () => {
  loading.value = true;
  try {
    const totalOrders:number = await ApiDashboardService.TotalOders();
    chartTotalOrders.value.series[0].data.push(totalOrders);
  } catch (err) {
    error.value = "No se pudieron cargar los datos del dashboard.";
  } finally {
    loading.value = false;
  }
};

const getTopUsers = async () => {
  loading.value = true;
  try {
    const totalUsers:UserTop[] = await ApiDashboardService.TopUsers();
    chartTopUsers.value.series[0].data = totalUsers.map(x => ({value: x.dineroTotalGastado, name: x.nombreCompleto}));
  } catch (err) {
    error.value = "No se pudieron cargar los datos del dashboard.";
  } finally {
    loading.value = false;
  }
};

const getMonthlySales = async () => {
  try {
    const year:number = new Date().getFullYear();
    const monthlySales = await ApiDashboardService.GetMonthlySales(year);
    Object.entries(monthlySales).forEach(([key, value]) => {
       
        chartMonthlySales.value.xAxis.data.push(key);
        chartMonthlySales.value.series[0].data.push(Number(value));
    });
  } catch (error) {
    
  }
}

const TotalUsers = async () => {
  try {
    
    const totalUsers:number = await ApiDashboardService.TotalUsers();
    chartTotalUsers.value.series[0].data.push(totalUsers);
  } catch (error) {
    
  }
}
onMounted(() => {
  getTotalOrders();
  getTopUsers();
  getMonthlySales();
  TotalUsers();
});

</script>