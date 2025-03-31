<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseBody from '@/components/BaseBody.vue';
import SignNav from '@/components/SignAccount/SignNav.vue';

const router = useRouter();
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const tokenInput = ref(''); // Para ingresar el token manualmente
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);
const errors = ref({ email: '', newPassword: '', confirmPassword: '', token: '' });
const token = new URLSearchParams(window.location.search).get('token'); 

const validateEmail = () => {
  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!email.value) {
    errors.value.email = 'El correo es obligatorio.';
  } else if (!emailPattern.test(email.value)) {
    errors.value.email = 'Correo inválido.';
  } else {
    errors.value.email = '';
  }
};

const validatePassword = () => {
  if (!newPassword.value || newPassword.value.length < 8) {
    errors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres.';
  } else {
    errors.value.newPassword = '';
  }

  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden.';
  } else {
    errors.value.confirmPassword = '';
  }
};

const sendResetEmail = async () => {
  validateEmail();
  if (errors.value.email) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const mailUrl = new URL(`/api/auth/sendMail/${email.value}`, process.env.VUE_APP_API_URL);
    const response = await fetch(mailUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json(); // Obtener el cuerpo de la respuesta
console.log(data); // Imprimir los datos de la respuesta para ver si hay más información


    if (!response.ok) {
      throw new Error('Error al enviar el correo');
    }

    successMessage.value = 'Correo enviado con instrucciones.';
  } catch (error) {
    errorMessage.value = error.message || 'Error al enviar el correo.';
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  validatePassword();
  if (errors.value.newPassword || errors.value.confirmPassword) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (!tokenInput.value) {
      errorMessage.value = "Token de recuperación es obligatorio.";
      loading.value = false;
      return;
    }

    const resetUrl = new URL(`/api/auth/forgot-password/${token}`, process.env.VUE_APP_API_URL);

    const response = await fetch(resetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: tokenInput.value, // Enviar el token proporcionado
        password: newPassword.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la contraseña.');
    }

    successMessage.value = 'Contraseña actualizada correctamente.';
    setTimeout(() => router.push('/login'), 3000);
  } catch (error) {
    errorMessage.value = error.message || 'Error al actualizar la contraseña.';
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="flex flex-col min-h-full">
    <SignNav :title="'Recuperar o Cambiar Contraseña'" />
    <BaseBody>
      <div class="flex flex-col gap-4 p-4">
        <!-- Formulario para ingresar todos los datos -->
        <BaseInput 
          identifier="email"
          placeholder="Ingrese el correo"
          label="Correo electrónico"
          type="email"
          v-model="email"
          :error="!!errors.email"
          :error-message="errors.email"
          @input="validateEmail"
        />

        <BaseInput 
          identifier="token"
          placeholder="Ingrese el token"
          label="Token de recuperación"
          type="text"
          v-model="tokenInput"
          :error="!!errors.token"
          :error-message="errors.token"
        />

        <BaseInput 
          identifier="new-password"
          placeholder="Nueva contraseña"
          label="Nueva contraseña"
          type="password"
          v-model="newPassword"
          @input="validatePassword"
          :error="!!errors.newPassword"
          :error-message="errors.newPassword"
        />

        <BaseInput 
          identifier="confirm-password"
          placeholder="Confirma tu contraseña"
          label="Confirmar contraseña"
          type="password"
          v-model="confirmPassword"
          @input="validatePassword"
          :error="!!errors.confirmPassword"
          :error-message="errors.confirmPassword"
        />

        <!-- Botón para enviar o cambiar contraseña -->
        <BaseButton @click="sendResetEmail" primary v-if="!tokenInput">
          {{ loading ? 'Procesando...' : 'Enviar correo de recuperación' }}
        </BaseButton>

        <BaseButton @click="resetPassword" primary v-if="tokenInput">
          {{ loading ? 'Procesando...' : 'Cambiar contraseña' }}
        </BaseButton>


        <!-- Mensajes de error o éxito -->
        <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>
        <div v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</div>
      </div>
    </BaseBody>
  </div>
</template>
