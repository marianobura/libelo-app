<script setup>
import { Calendar, Eye, EyeOff, Search } from 'lucide-vue-next';
import { defineProps, defineEmits, ref } from 'vue'

defineProps({
    identifier: String,
    placeholder: String,
    label: String,
    type: {
        type: String,
        default: 'text'
    },
    password: {
        type: Boolean,
        default: false
    },
    reset: {
        type: Boolean,
        default: false
    },
    search: {
        type: Boolean,
        default: false
    },
    calendar: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        required: false
    },
    error: {
        type: Boolean,
        default: false,
    },
    errorMessage: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue']);

const isPasswordVisible = ref(false);

const togglePasswordVisibility = (event) => {
    event.preventDefault();
    isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
    <div class="flex flex-col gap-1 w-full">
        <div v-if="label" class="block" :class="reset ? 'flex justify-between gap-4 items-center' : ''">
            <label class="font-semibold" :class="{ 'text-red-500': error }" :for="identifier">{{ label }}</label>
            <router-link v-if="reset" to="/reset-password" class="text-libelo-500 font-semibold text-sm hover:underline">¿Olvidaste tu contraseña?</router-link>
        </div>
        <div class="w-full" :class="password || search || calendar ? 'relative' : ''">
            <input class="w-full text-neutral-700 outline outline-1 -outline-offset-1 outline-neutral-300 rounded-xl py-3 px-4 leading-tight focus:outline-2 focus:bg-white focus:outline-libelo-500"
                :class="{
                    'bg-red-100 outline-red-500 placeholder:text-neutral-500': error,
                    'pr-12 peer' : password,
                    'pl-11 peer' : search || calendar,
                }"
                :name="identifier" :id="identifier" :type="password ? (isPasswordVisible ? 'text' : 'password') : type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
            <span v-if="password" class="absolute top-0 right-0 size-11 flex items-center justify-center flex-shrink-0 peer-focus:text-libelo-500" @mousedown="togglePasswordVisibility">
                <Eye v-if="!isPasswordVisible"/>
                <EyeOff v-else />
            </span>
            <span v-if="search || calendar" class="absolute top-0 left-0 size-11 flex items-center justify-center flex-shrink-0 peer-focus:text-libelo-500">
                <Search v-if="search" size="20" />
                <Calendar v-else-if="calendar" size="20" />
            </span>
        </div>
        <span v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
        </span>
    </div>
</template>