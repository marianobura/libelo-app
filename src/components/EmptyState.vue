<script setup>
import { defineProps, computed } from 'vue';
import { BellOff, MailX, BookX } from 'lucide-vue-next';

const props = defineProps({
    title: String,
    description: String,
    icon: String,
});

const icons = { BellOff, MailX, BookX };

const SelectedIcon = computed(() => icons[props.icon]);
</script>

<template>
    <div class="flex flex-col gap-2 items-center justify-center w-full text-neutral-800">
        <component :is="SelectedIcon" size="64" />
        <div class="flex flex-col">
            <span class="text-center text-xl font-medium text-700 border-b border-neutral-300 pb-2">{{ title }}</span>
            <span class="text-center pt-2 max-w-64">{{ description }}</span>
        </div>
    </div>
</template>
