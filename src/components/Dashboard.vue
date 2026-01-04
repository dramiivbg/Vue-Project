<template>
    
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ApiDashboardService from '@/shared/services/ApiDashboardService';
import { UserTop } from '@/shared/models/UserTop';
const totalOrders = ref(0);
const totalUsers = ref<UserTop[]>(null);
const loading = ref(false);
const error = ref(null);
const getTotalOrders = async () => {
  loading.value = true;
  try {
    totalOrders.value = await ApiDashboardService.TotalOders();
  } catch (err) {
    error.value = "No se pudieron cargar los datos del dashboard.";
  } finally {
    loading.value = false;
  }
};

const getTopUsers = async () => {
  loading.value = true;
  try {
    totalUsers.value = await ApiDashboardService.TopUsers();
    console.log(totalUsers.value);
  } catch (err) {
    error.value = "No se pudieron cargar los datos del dashboard.";
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  getTotalOrders();
  getTopUsers();
});

</script>