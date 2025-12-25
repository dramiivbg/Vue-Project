
import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css';

import router from './router'
import { jwtDecode } from "jwt-decode";

const app = createApp(App);

// Función reutilizable para verificar el rol
const checkRole = (el, binding) => {
  const token = localStorage.getItem('user_token');
  //console.log(token)
  const roleRequired = binding.value;

  if (!token) {
    el.style.display = 'none'; // Ocultar si no hay token
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (userRole === roleRequired) {
      el.style.display = ''; // Mostrar si el rol coincide
    } else {
      el.style.display = 'none'; // Ocultar si no coincide
    }
  } catch (error) {
    el.style.display = 'none';
  }
};

app.directive('role', {
  // Cuando el elemento se inserta en el DOM
  mounted(el, binding) {
    checkRole(el, binding);
  },
  // Cuando el componente que contiene la directiva se actualiza
  updated(el, binding) {
    checkRole(el, binding);
  }
});

app.use(router).mount('#app')
