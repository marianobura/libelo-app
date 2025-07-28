<script setup>
import { defineProps, computed } from 'vue';
import { BellOff, MailX, BookX, SearchX, TicketCheck } from 'lucide-vue-next';

const props = defineProps({
    title: String,
    description: String,
    icon: String,
});

const icons = { BellOff, MailX, BookX, SearchX, TicketCheck };

const SelectedIcon = computed(() => icons[props.icon]);
</script>

<template>
    <div class="flex flex-col gap-2 items-center justify-center w-full text-neutral-800">
        <component :is="SelectedIcon" size="48" />
        <div class="flex flex-col items-center">
            <span class="text-center text-xl font-medium text-700 pb-2">{{ title }}</span>
            <span class="text-center max-w-64 pt-2 border-t border-neutral-300">{{ description }}</span>
        </div>
    </div>
</template>
