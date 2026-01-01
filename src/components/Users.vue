<template>

  <div class="max-w-md mx-auto mb-8">
    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Buscar</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      
      <input 
        v-model="searchTerm"
        type="search" 
        id="search" 
        class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all outline-none" 
        placeholder="Buscar productos por nombre..." 
      />
      
      <button 
        @click="onNew"
        v-role="'administrator'"
        class="text-white absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
      >
        new User
      </button>
    </div>
  </div>

<div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">


      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="user in users" 
          :key="user.idUsuario" 
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative group hover:shadow-md transition-all"
        >
          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="handleEdit(user.idUsuario)"
              class="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button v-if="user.active"
              @click="handleDeactivate(user.idUsuario)"
              class="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
              title="Desactivar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button  v-else
              @click="handleActive(user.idUsuario)"
              class="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition"
              title="Activar"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          <div class="flex flex-col items-center">
            <div class="relative">
              <img :src="'/logo.svg'" class="w-20 h-20 rounded-full ring-4 ring-gray-50 object-cover">
              <div 
                class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
                :class="user.active ? 'bg-green-500' : 'bg-gray-300'"
              ></div>
            </div>

            <h3 class="mt-4 text-lg font-bold text-gray-900">{{ user.nombreCompleto }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ user.correo }}</p>
            
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 uppercase">
              {{ user.rol }}
            </span>

            <div class="mt-6 w-full pt-4 border-t border-gray-50 flex justify-center">
              <button class="text-indigo-600 font-medium text-sm hover:underline">
                Ver actividad reciente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApiUserService from '@/shared/services/ApiUserService';
import { User } from '@/shared/models/User';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const users = ref<User[]>(null);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');

const  getUsers = async () => {
  loading.value = true;
  try {
    const search = 'NA';
    users.value = await ApiUserService.List(search);
    console.log(users.value)
  } catch (err) {
    error.value = "No se pudieron cargar los usuarios.";
  } finally {
    loading.value = false;
  }
};

const onNew = () => {
  router.push({ name: 'User', params: {id: 0}});
}

const handleEdit = (id:number) => {
  router.push({ name: 'User', params: {id}});
};

const handleDeactivate = async (id: number) => {
  if (confirm("¿Estás seguro de que deseas Desactivar este usuario?")) {
    try {
        await ApiUserService.Deactivate(id);
        var user = users.value.find(user => user.idUsuario == id);
        user.active = false;
        alert("Usuario Desactivado");
    } catch (error) {
        alert(error.message);
    }
  }
};

const handleActive = async (id: number) => {
  try {
        await ApiUserService.Activate(id);
        var user = users.value.find(user => user.idUsuario == id);
        user.active = true;
        alert("Usuario Activado");
    } catch (error) {
        alert(error.message);
  }
};

// Se ejecuta automáticamente al entrar al componente
onMounted(() => {
  getUsers();
});

</script>

<style scoped>

</style>