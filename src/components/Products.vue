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
            cantidad: {{ product.cantidadInventory }}
          </p>

          <p class="text-gray-600 text-sm line-clamp-2 mb-4">
            {{ product.descripcion || 'Sin descripción disponible para este producto.' }}
          </p>

          <div class="flex flex-col gap-3 pt-4 border-t border-gray-100">

            <button @click="addToCartP(product)" :disabled ="!(product.cantidadInventory > 0)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar al carrito
            </button>

            <div v-role="'administrator'" class="flex gap-2">
              <button @click="handleUpdate(product.idProducto)"
                class="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 py-2 px-3 rounded-lg text-xs font-bold transition-colors border border-amber-200">
                Actualizar
              </button>
              <button @click="handleDelete(product.idProducto)"
                class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-xs font-bold transition-colors border border-red-200">
                Eliminar
              </button>
            </div>
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
import ApiProductService from '@/shared/services/ApiProductService';
import { addToCart, products } from '@/cartStatus';
import Swal from 'sweetalert2';

const router = useRouter();

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

const addToCartP = async (product:Product) => {
  addToCart(product);
  product.cantidadInventory -= 1;
}
const  getProducts = async () => {
  loading.value = true;
  try {
    const search = 'NA';
    products.value = await ApiProductService.List(search);
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
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProduct(id);
    }
  });
};

const deleteProduct = async (id) => {
  try {
    await ApiProductService.Delete(id);
    // Filtrar la lista localmente para no recargar toda la página
    products.value = products.value.filter(p => p.idProducto !== id);
    Swal.fire(
      'Eliminado',
      'El producto ha sido eliminado.',
      'success'
    );
  } catch (err) {
    if(err.message === "An error occurred while saving the entity changes. See the inner exception for details."){
      err.message = "No se puede eliminar el producto porque tiene órdenes asociadas.";
    }
    Swal.fire(
      'Error',
      err.message,
      'error'
    );
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