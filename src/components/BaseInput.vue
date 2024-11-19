<script setup>
import { defineProps, defineEmits } from 'vue'

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
})

defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex flex-col gap-1 w-full">
        <div class="flex justify-between">
            <label class="font-semibold" :for="identifier">{{ label }}</label>
            <span v-if="password" class="text-libelo-500 text-sm">Me olvidé la contraseña</span>
        </div>
        <input class="w-full text-gray-700 border rounded-xl py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
        :class="{
            'border-gray-300': !error, 
            'bg-red-100 border-red-500': error
        }"
        :name="identifier" :id="identifier" :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
    </div>
</template>