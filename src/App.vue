
<template>
<nav v-if="userData.idUsuario !== 0" class="bg-white border-b border-gray-200 fixed w-full z-30 top-0 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        
        <div class="flex items-center gap-8">
          <div class="flex-shrink-0 flex items-center font-bold text-blue-600 text-xl">
            MiApp
          </div>
          <div class="hidden md:flex space-x-4">
            <router-link to="/products" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Productos
            </router-link>
            <router-link v-role="'administrator'" to="/dashboard" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Dashboard
            </router-link>
            <router-link v-role="'administrator'" to="/users" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Usuarios
            </router-link>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div @click="showCart = true" class="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            <transition name="bounce">
              <span 
                v-if="cartCount > 0" 
                :key="cartCount"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full shadow-sm"
              >
                {{ cartCount }}
              </span>
            </transition>
          </div>

          <transition name="slide">
            <div v-if="showCart" class="fixed inset-0 z-[100] overflow-hidden">
              <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="showCart = false"></div>

              <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col">

                  <div class="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-800">Tu Carrito ({{ cartCount }})</h2>
                    <button @click="showCart = false" class="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                  </div>

                  <div class="flex-1 py-6 overflow-y-auto px-6 space-y-6">
                    <div v-if="cart.length === 0" class="text-center py-20">
                      <p class="text-gray-400">Tu carrito está vacío</p>
                    </div>

                    <div v-for="(item, index) in cart" :key="index" class="flex gap-4 border-b border-gray-100 pb-4">
                      <img :src="item.imagen || '/logo.svg'"
                        class="h-20 w-20 rounded-lg object-cover bg-gray-100">

                      <div class="flex-1">
                        <h4 class="font-bold text-gray-800 text-sm">{{ item.nombre }}</h4>
                        <p class="text-xs text-gray-500 line-clamp-1">{{ item.descripcion }}</p>
                        <div class="flex justify-between items-center mt-2">
                          <span class="text-blue-600 font-bold">{{ item.precio }}</span>
                          <span class="text-xs bg-gray-100 px-2 py-1 rounded">Cant: {{ item.quantity }}</span>
                        </div>
                      </div>

                      <button @click="removeItem(index)" class="text-red-500 hover:text-red-700 p-2 transition-colors"
                        title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 px-6 py-6 bg-gray-50 space-y-4">
                    <div class="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total Estimado</span>
                      <span>{{formatPrice(cart.reduce((t, i) => t + (i.precio * i.quantity), 0))}}</span>
                    </div>
                    <button
                       @click="onPaid" :disabled="loading"
                      class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
    
                      {{ loading ? "Comprando..." : "Finalizar Compra" }}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </transition>

          <button @click="showModal = true" class="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition-all">
            <span class="hidden sm:block text-sm font-medium text-gray-700">{{ userData.nombreCompleto }}</span>
            <img :src="getAvatar(userData.nombreCompleto)" class="h-9 w-9 rounded-full border-2 border-blue-100" alt="User">
          </button>
        </div>

      </div>
    </div>
  </nav>
  

  <transition name="pop">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="showModal = false"></div>
      
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
        <div class="bg-gradient-to-r from-blue-600 to-blue-400 h-24 relative">
          <button @click="showModal = false" class="absolute top-4 right-4 text-white hover:scale-110 transition-transform">
             ✕
          </button>
        </div>
        
        <div class="px-6 pb-6 text-center">
          <div class="relative -mt-12 mb-4 inline-block">
            <img :src="getAvatar(userData.nombreCompleto)" 
                 class="w-24 h-24 rounded-3xl border-4 border-white shadow-lg mx-auto cursor-pointer hover:rotate-3 transition-transform"
                 @click="goToProfile">
            <div class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800">{{ userData.nombreCompleto }}</h3>
          <span class="inline-block px-3 py-1 mt-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full uppercase tracking-wider">
            {{ userData.rol }}
          </span>

          <div class="mt-6 space-y-3 text-left">
            <div class="p-3 bg-gray-50 rounded-xl">
              <label class="text-[10px] font-bold text-gray-400 uppercase">Email</label>
              <p class="text-sm text-gray-700 font-medium">{{ userData.correo }}</p>
            </div>
          </div>

          <button @click="handleLogout" class="mt-8 w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </transition>

  <main class="pt-20 pb-10 min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <router-view></router-view>
    </div>
  </main>
</template>

<script setup lang="ts">
 import { useRouter } from 'vue-router';
import { clearAuth, updateAuth, userData } from '@/autStatus';
import { onMounted, ref } from 'vue';
import { cart, cartCount, DelToCart } from '@/cartStatus';

const router = useRouter();

const showModal = ref(false);

const showCart = ref(false);

const loading = ref(false);

onMounted(() => updateAuth());

// Avatar dinámico basado en el nombre del usuario
const getAvatar = (name: string) => {
  const formattedName = name ? encodeURIComponent(name) : 'User';
  return `https://ui-avatars.com/api/?name=${formattedName}&background=0D8ABC&color=fff`;
};


const removeItem = (index: number) => {
  DelToCart(index);
};

// Formatear moneda
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
};

const handleLogout = () => {
  clearAuth();
  // 3. Redirigir al login
  window.location.reload();
  router.push("/login");
  // Opcional: Recargar para limpiar estados de la app
  //window.location.reload();
};

const goToProfile = () => {
  showModal.value = false;
  router.push({ name: 'User', params: {id: userData.value.idUsuario}});
}

const onPaid = async () => {
  showCart.value = false;
  router.push('/payment');
}
</script>

<style scoped>

.pop-enter-active, .pop-leave-active {
  transition: all 0.3s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Animación para que el número salte al agregar productos */
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
@keyframes bounce-in {
  0% { transform: scale(0) translate(50%, -50%); }
  50% { transform: scale(1.5) translate(33%, -33%); }
  100% { transform: scale(1) translate(50%, -50%); }
}

/* Animación de entrada por la derecha */
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s ease-in-out;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

/* Para recortar la descripción si es muy larga */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>

