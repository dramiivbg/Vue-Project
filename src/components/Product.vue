
<template>
  <div class="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <span class="bg-blue-600 w-2 h-8 rounded-full"></span>
      Nuevo Producto
    </h2>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
        <input v-model="product.nombre" type="text" required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Ej: Silla Gamer">
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
        <textarea v-model="product.descripcion" rows="3"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Describe los detalles del producto..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
        <input v-model="product.precio" type="number" step="0.01" required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Cantidad</label>
        <input v-model="product.cantidad" type="number" required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">URL de la Imagen</label>
        <input v-model="product.imagen" type="url"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="https://ejemplo.com/imagen.jpg">
      </div>

      <div class="md:col-span-2 flex gap-4 mt-4">
        <button type="button" @click="router.back()"
          class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="loading"
          class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:bg-blue-300">
          {{ loading ? 'Guardando...' : title }}
        </button>
      </div>

    </form>
  </div>
</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { Product } from '@/shared/models/Product';
import ApiProductService from '@/shared/services/ApiProductService';

const router = useRouter();

const route = useRoute();

const id = Number(route.params.id);

const error = ref(null);

const title = ref('');

// 1. Definir el objeto del producto con los campos exactos
const product = ref<Product>({
  idProducto: 0,
  nombre: '',
  descripcion: '',
  precio: 0,
  cantidad: 0,
  imagen: '',
  cantidadInventory: 0
});

const loading = ref(false);


const getProduct = async (id:number) => {
    try {
        product.value = await ApiProductService.GetById(id);
    } catch (err) {
       error.value = "No se pudo obtener el producto"
    }
    
}

const decodePassword = async (encode:string) => {
  
}

onMounted(() => {
 if(id > 0){
    title.value = "Actualizar Producto";
    getProduct(id);
 }else {
    title.value = "Crear Producto";
 }
});


const handleSubmit = async () => {
  loading.value = true;
  const token = localStorage.getItem('user_token');

    try {
        // Es importante asegurar que precio y cantidades sean números al enviar
        const payload = {
            ...product.value,
            precio: Number(product.value.precio),
            cantidad: Number(product.value.cantidad),
        };

        if (id == 0) {
            await ApiProductService.Create(payload);
            alert("¡Producto creado con éxito!");
        } else {
            await ApiProductService.Edit(payload);
            alert("¡Producto actualizado con éxito!");
        }
        router.push('/products'); // Redirigir al listado
    } catch (error) {
        console.error("Error al crear:", error);
        alert("Hubo un error al guardar el producto");
    } finally {
        loading.value = false;
    }
};
</script>


