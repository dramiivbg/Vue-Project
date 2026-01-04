<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    
    <div class="max-w-xl w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
        <p class="mt-2 text-sm text-gray-600">Regístrate para empezar a gestionar tus productos</p>
      </div>

      <form @submit.prevent="onRegister" class="space-y-5">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-field">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
            <input
              v-model="formData.nombreCompleto"
              type="text"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div class="form-field">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
            <input
              v-model="formData.correo"
              type="email"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-field">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <input
              v-model="formData.clave"
              type="password"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="form-field">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              v-model="formData.confirmarClave"
              type="password"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div class="form-field">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Rol de Usuario</label>
          <select 
            v-model="formData.rol" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Selecciona un rol</option>
            <option value="administrator">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>

        <div class="form-field">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Usuario Activo</label>
          <select 
            v-model="formData.active" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Seleccionar</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? "Creando cuenta..." : title }}
          </button>
        </div>

        <transition name="fade">
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
            <span class="text-red-500">⚠️</span>
            <p class="text-sm text-red-700 font-medium">{{ errorMessage }}</p>
          </div>
        </transition>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import ApiUserService from '@/shared/services/ApiUserService';
import { useRoute, useRouter } from "vue-router";
import { User } from "@/shared/models/User";
import Swal from "sweetalert2";

const route = useRoute();

const router = useRouter();

const id = Number(route.params.id);

const title = ref('');

const loading = ref(false);
let errorMessage = ref("");

// Agrupamos las propiedades en un solo objeto
let formData = ref<User>({
  nombreCompleto: "",
  correo: "",
  clave: "",
  confirmarClave: "",
  rol: "", // Valor inicial vacío
  active: true
});

const getUser = async (id:number) => {
    try {
        formData.value = await ApiUserService.GetById(id);
        formData.value.clave = "";
    } catch (err) {
      Swal.fire(
        'Error',
        err.message,
        'error'
      );
       router.back();
    }
    
}


onMounted(() => {
 if(id > 0){
    title.value = "Actualizar Producto";
    getUser(id);
 }else {
    title.value = "Crear Producto";
 }
});

const onRegister = async () => {
  loading.value = true;
  try {

    if(id === 0){
      await ApiUserService.Create(formData.value);
      Swal.fire(
        'Usuario Creado',
        `¡Usuario ${formData.value.nombreCompleto} registrado como ${formData.value.rol}!`,
        'success'
      );
    }else{
        await ApiUserService.Edit(formData.value);
        Swal.fire(
          'Usuario Actualizado',
          `¡Usuario ${formData.value.nombreCompleto} actualizado como ${formData.value.rol}!`,
          'success'
        );
    }

    router.push('/users');
    
  } catch (error) {
    errorMessage = error.message;
  }finally{
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>