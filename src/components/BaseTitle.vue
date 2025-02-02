<script setup>
import { defineProps } from 'vue'

defineProps({
    title: String,
    description: String,
})
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-col">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <p class="text-sm text-neutral-700">{{ description }}</p>
        </div>
        <slot />
    </div>
</template>