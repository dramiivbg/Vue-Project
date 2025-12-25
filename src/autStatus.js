import { ref } from 'vue';

// Definimos el token de forma reactiva fuera del componente
export const token = ref(localStorage.getItem("user_token"));

export const updateAuth = () => {
  token.value = localStorage.getItem("user_token");
};

export const clearAuth = () => {
  localStorage.removeItem("user_token");
  token.value = null;
};


export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos

    // Si el tiempo de expiración es menor al tiempo actual, ya expiró
    return decoded.exp < currentTime;
  } catch (error) {
    // Si el token está mal formado, lo tratamos como expirado
    return true;
  }
};