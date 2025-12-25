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
        new Product
      </button>
    </div>
  </div>

    <div class="p-6 bg-gray-100 min-h-screen">
      
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Cargando productos...</p>
    </div>

    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-6">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="product in filteredProducts" 
        :key="product.idProducto" 
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200"
      >
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <img 
            :src="product.imagen || '/logo.svg'" 
            class="object-cover h-full w-full"
            alt="Producto" 
          >
        </div>

        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-gray-900 truncate">{{ product.nombre }}</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              ${{ product.precio }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm line-clamp-2 mb-4">
            {{ product.descripcion || 'Sin descripción disponible para este producto.' }}
          </p>

          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <button  
              v-role="'administrator'"
              @click="handleUpdate(product.idProducto)"
              class="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Actualizar
            </button>
            <button 
              v-role="'administrator'"
              @click="handleDelete(product.idProducto)"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Product } from '@/shared/models/Product';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { List, Delete } from '../Api';

const router = useRouter();

const products = ref<Product[]>(null);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');

// 3. La lista filtrada que realmente mostrarás en el v-for
const filteredProducts = computed(() => {
  if (!searchTerm.value) return products.value;
  
  return products.value.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const onNew = () => {
  router.push({ name: 'Product', params: {id: 0}});
}

const  getProducts = async () => {
  loading.value = true;
  try {
    const search = 'NA';
    products.value = await List('Product', search);
    //console.log(products.value)
  } catch (err) {
    error.value = "No se pudieron cargar los productos.";
  } finally {
    loading.value = false;
  }
};

// Se ejecuta automáticamente al entrar al componente
onMounted(() => {
  getProducts();
});

// Acciones
const handleUpdate = (id) => {
    router.push({ name: 'Product', params: {id}});
};

const handleDelete = async (id) => {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  try {
    await Delete('Product', id);
    // Filtrar la lista localmente para no recargar toda la página
    products.value = products.value.filter(p => p.idProducto !== id);
    alert("Producto eliminado");
  } catch (err) {
    alert("Error al eliminar");
  }
};

</script>

<style scoped>

  /* Líneas máximas para la descripción */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

</style>