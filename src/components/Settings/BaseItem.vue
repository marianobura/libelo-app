<script setup>
import { ChevronRight } from 'lucide-vue-next';
import { defineProps } from 'vue';

defineProps({
    title: String,
    icon: Function,
});
</script>

<template>
    <div class="flex items-center justify-between bg-white w-full p-3 rounded-xl">
        <div class="flex gap-2 items-center">
            <div class="flex items-center justify-center bg-neutral-200/60 size-10 rounded-lg">
                <component :is="icon" :size="24" />
            </div>
            <p>{{ title }}</p>
        </div>
        <ChevronRight :size="24" />
    </div>
</template>