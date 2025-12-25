<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Accede a tu panel de productos
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md space-y-4">
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.correo" 
              required
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="ejemplo@correo.com"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.clave" 
              required
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="********"
            >
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? "Cargando..." : "Entrar" }}
          </button>

          <div class="text-center">
            <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 text-sm transition-colors">
              ¿No tienes cuenta? Regístrate aquí
            </router-link>
          </div>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 rounded mt-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 font-medium">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { User } from '@/shared/models/User';

import { Login } from '../Api';

const router = useRouter();
// Definimos variables reactivas
const formData = reactive({
  correo: "",
  clave: "",
});

const UserData = ref<User>(null);

const loading = ref(false);
let errorMessage = ref('');
const handleLogin = async () => {
  loading.value = true;
  errorMessage = ref('');
  try {
      UserData.value = await Login(formData);
      localStorage.setItem('user_token', UserData.value.token);
      router.replace('/products');

      // Opcional: Limpiar el formulario
      Object.assign(formData, {
        nombreCompleto: "",
        correo: "",
        clave: "",
        confirmarClave: "",
        rol: "", // Valor inicial vacío
      });
  } catch (error) {
    errorMessage = error.message;
  }finally{
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}
.input-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  font-size: 0.9em;
  margin-top: 10px;
}
</style>