<script setup>
import { ref } from 'vue';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';
import { useUserStore } from '@/stores/userStore';
import { CircleAlert } from 'lucide-vue-next';
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import { useRouter } from 'vue-router'; // Asegúrate de importar el router

const router = useRouter();

const password = ref('');
const confirmPassword = ref('');  // Declaramos confirmPassword
const errorMessage = ref('');
const loading = ref(false);
const userStore = useUserStore();
const userId = ref(userStore.user?._id);

const errors = ref({
  email: '',
  password: '',
  confirmPassword: '', // Agregamos validación para confirmPassword
});

// Validación de contraseña
const validatePassword = () => {
  if (password.value === '') {
    errors.value.password = 'La contraseña es obligatoria.';
  } else {
    errors.value.password = '';
  }
};

// Validación de confirmación de contraseña
const validateConfirmPassword = () => {
  if (confirmPassword.value === '') {
    errors.value.confirmPassword = 'La confirmación de la contraseña es obligatoria.';
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden.';
  } else {
    errors.value.confirmPassword = '';
  }
};

// Validación del formulario
const validateForm = () => {
  validatePassword();
  validateConfirmPassword();
  return !Object.values(errors.value).some((error) => error !== '');
};

const handleRecovery = async () => {
  if (!validateForm()) {
    return;
  }

  errorMessage.value = '';
  loading.value = true;

  try {
    const apiUrl = `${import.meta.env.VITE_API_URL}/users/${userId.value}`;
    const response = await axios.put(apiUrl, { password: password.value });

    if (response.status === 200) {
      router.push('/login');
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.msg || 'Ocurrió un error inesperado.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <BaseBody>
      <BaseNav title="Cambiar contraseña" />
      <div class="flex flex-col gap-2 p-2">
        <div class="flex flex-col gap-4">
          <BaseInput 
            password 
            identifier="password" 
            placeholder="Ingrese una nueva contraseña" 
            label="Contraseña" 
            type="password" 
            v-model="password" 
            :error="!!errors.password" 
            :error-message="errors.password" 
            @input="validatePassword" 
          />
          <BaseInput 
            password 
            identifier="confirmPassword" 
            placeholder="Confirme su nueva contraseña" 
            label="Confirmar contraseña" 
            type="password" 
            v-model="confirmPassword" 
            :error="!!errors.confirmPassword" 
            :error-message="errors.confirmPassword" 
            @input="validateConfirmPassword" 
          />
          <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
            <CircleAlert :size="16" />
            <span class="text-sm">{{ errorMessage }}</span>
          </div>
  
          <div class="flex flex-col gap-2">
            <BaseButton @click="handleRecovery" :disabled="loading" primary>
              {{ loading ? 'Enviando correo...' : 'Recuperar contraseña' }}
            </BaseButton>
  
            <div class="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 h-12 w-full">
              <hr class="w-full border-neutral-300" />
              <span class="text-neutral-700 text-sm text-center">o inicia sesión con</span>
              <hr class="w-full border-neutral-300" />
            </div>
  
            <GoogleLogin />
          </div>
        </div>
  
        <div>
          <div class="flex items-center justify-center h-12 w-full">
            <p class="text-neutral-700">¿Ya tienes una cuenta? 
              <router-link to="/login" class="text-libelo-500 font-semibold ml-1">Iniciar sesión</router-link>
            </p>
          </div>
          
          <div class="flex items-center justify-center w-full">
            <p class="text-neutral-700">¿No tienes una cuenta? 
              <router-link to="/register" class="text-libelo-500 font-semibold ml-1">Regístrate ahora</router-link>
            </p>
          </div>
        </div>
      </div>
    </BaseBody>
  </template>
  