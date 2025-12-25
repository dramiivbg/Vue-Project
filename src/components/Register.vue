<template>
  <div class="register-card">
    <h2>Crear Cuenta</h2>
    <form @submit.prevent="onRegister">
      <div class="form-field">
        <label>Nombre Completo</label>
        <input
          v-model="formData.nombreCompleto"
          type="text"
          placeholder="Juan Pérez"
          required
        />
      </div>

      <div class="form-field">
        <label>Correo Electrónico</label>
        <input
          v-model="formData.correo"
          type="email"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div class="form-field">
        <label>Contraseña</label>
        <input
          v-model="formData.clave"
          type="password"
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>

      <div class="form-field">
        <label>Confirmar Contraseña</label>
        <input
          v-model="formData.confirmarClave"
          type="password"
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>

      <div class="form-field">
        <label>Rol</label>
        <select v-model="formData.rol" required>
          <option value="" disabled>Selecciona un rol</option>
          <option value="administrator">Administrador</option>
          <option value="user">Usuario</option>
        </select>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Registrando..." : "Registrarse" }}
      </button>

      <router-link to="/login">Login</router-link>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { Create } from '../Api';

const loading = ref(false);
let errorMessage = ref("");

// Agrupamos las propiedades en un solo objeto
const formData = reactive({
  nombreCompleto: "",
  correo: "",
  clave: "",
  confirmarClave: "",
  rol: "", // Valor inicial vacío
});

const onRegister = async () => {
  loading.value = true;
  try {
    await Create('User', formData);
    alert(`Usuario ${formData.nombreCompleto} registrado como ${formData.rol}`);

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
.register-card {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: white;
}

.form-field {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input,
select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #3fb27f;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background-color: #ccc;
}
</style>