import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

// Definimos el token de forma reactiva fuera del componente
export const userData = ref({
    clave: "",
    correo: "",
    nombreCompleto: "",
    rol: "",
    confirmarClave: "",
    idUsuario: 0,
    token: ""
  });

export const updateAuth = () => {
  const token = localStorage.getItem('user_token');
  if(!token) return;
  
  const decoded = jwtDecode(token);
  const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const nombreCompleto = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const idUser = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

  userData.value = {
    ...userData.value,
    correo: email,
    nombreCompleto: nombreCompleto,
    rol: userRole,
    idUsuario: Number(idUser),
    token:token
  };

  console.log(userData.value)
};

export const clearAuth = () => {
  localStorage.removeItem("user_token");
  Object.assign(userData, {
    clave: "",
    correo: "",
    nombreCompleto: "",
    rol: "",
    confirmarClave: "",
    idUsuario: 0,
    token: ""
  });
  //window.location.replace('/login');
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