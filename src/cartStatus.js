import { ref, computed } from 'vue';

export const cart = ref([]);
export const products = ref([]);

// Función para añadir productos
export const addToCart = (product) => {
  const existing = cart.value.find(item => item.idProducto === product.idProducto);
  if (existing) {
    existing.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

export const DelToCart = (index) => {
  const cartP = cart.value[index];
  var product = products.value.find(x => x.idProducto == cartP.idProducto);
  if(product){
    product.cantidadInventory += cartP.quantity;
    cart.value.splice(index, 1);
  }
};

// Total de productos para el badge
export const cartCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});