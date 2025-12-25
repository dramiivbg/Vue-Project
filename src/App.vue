
<template>
  <div id="nav" v-role="'user'">
    <router-link to="/products">Products</router-link>

    <a href="#" @click.prevent="handleLogout" class="logout-btn">Logout</a>
  </div>

  <div id="nav" v-role="'administrator'">
    <router-link to="/products">Products</router-link>
    <router-link  to="/dashboard">Dashboard</router-link>
    <router-link  to="/users">Users</router-link>

    <a href="#" @click.prevent="handleLogout" class="logout-btn">Logout</a>
  </div>

  <div class="container">
    <router-view :key="componentKey"></router-view>
  </div>
</template>

<script setup>
 import { useRouter } from 'vue-router';
import { clearAuth } from './autStatus';
import { componentKey } from './refrechComponents';
const router = useRouter();

const handleLogout = () => {
  clearAuth();
  // 3. Redirigir al login
  window.location.reload();
  router.push("/login");
  // Opcional: Recargar para limpiar estados de la app
  //window.location.reload();
};
</script>

