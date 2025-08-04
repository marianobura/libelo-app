<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: String,
    icon: Function,
});
</script>

<template>
    <div class="flex flex-col gap-2 items-center justify-center w-full text-neutral-800">
        <component :is="props.icon" size="48" />
        <div class="flex flex-col items-center">
            <span class="text-center text-xl font-medium text-700 pb-2">{{ props.title }}</span>
            <span class="text-center max-w-64 pt-2 border-t border-neutral-300"><slot></slot></span>
        </div>
    </div>
</template>
