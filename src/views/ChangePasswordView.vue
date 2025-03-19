<script setup>
import { ref } from 'vue';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseBody from '@/components/BaseBody.vue';
import SignNav from '@/components/SignAccount/SignNav.vue';

const email = ref('');
const errorMessage = ref('');
const loading = ref(false);
const successMessage = ref('');
const errors = ref({ email: '' });

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = 'El correo es obligatorio.';
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = 'Correo inválido.';
  } else {
    errors.value.email = '';
  }
};

const validateForm = () => {
  validateEmail();
  return !errors.value.email;
};

const handleRecovery = async () => {
  if (!validateForm()) return;

  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    // Validamos si el correo no está vacío antes de enviar la solicitud
    if (email.value.trim()) {
      const apiUrl = new URL(`/auth/${email.value}/forgot-password`, process.env.VUE_APP_API_URL).toString();

      console.log('Enviando solicitud a:', apiUrl);

      // Enviamos la solicitud POST con la URL correcta
      const response = await axios.post(apiUrl);

      if (response.status === 200) {
        successMessage.value = 'Correo enviado con instrucciones.';
      }
    } else {
      errorMessage.value = 'Por favor, ingrese un correo electrónico válido.';
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    errorMessage.value = error.response?.data?.msg || 'Error al enviar el correo.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
<div class="flex flex-col min-h-full">
 <SignNav title="Recuperar contraseña" />
  <BaseBody>
    <div class="flex flex-col gap-2 p-2">
      <div class="flex flex-col gap-4">
        <BaseInput 
          identifier="email" 
          placeholder="Ingrese su correo" 
          label="Correo electrónico" 
          type="email" 
          v-model="email" 
          :error="!!errors.email" 
          :error-message="errors.email" 
          @input="validateEmail" 
        />

        <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>
        <div v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</div>

        <BaseButton @click="handleRecovery" :disabled="loading" primary>
          {{ loading ? 'Enviando...' : 'Enviar correo de recuperación' }}
        </BaseButton>
      </div>
    </div>
  </BaseBody>
</div>
</template>
