<script setup>
import { Eye, EyeOff } from 'lucide-vue-next';
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

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
    <div class="flex flex-col gap-1 w-full">
        <div class="flex justify-between">
            <label class="font-semibold" :class="{ 'text-red-500': error }" :for="identifier">{{ label }}</label>
        </div>
        <div class="w-full" :class="password ? 'flex gap-2' : ''">
            <input class="w-full text-gray-700 border rounded-xl py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 pr-10"
                :class="{
                    'border-gray-300': !error, 
                    'bg-red-100 border-red-500': error
                }"
                :name="identifier" :id="identifier" :type="password ? (isPasswordVisible ? 'text' : 'password') : type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
            <button v-if="password" type="button" class="size-[46px] flex items-center justify-center flex-shrink-0 bg-white border border-gray-300 rounded-xl" @click="togglePasswordVisibility">
                <Eye v-if="!isPasswordVisible"/>
                <EyeOff v-else />
            </button>
        </div>
        <span v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
        </span>
    </div>
</template>