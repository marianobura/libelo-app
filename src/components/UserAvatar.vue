<script setup>
import { defineProps, computed } from 'vue';
import { goTo } from '@/router';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
    size: {
        type: String,
        default: "12"
    },
    orange: {
        type: Boolean,
        default: false
    },
    userLetter: {
        type: String,
        default: null
    },
    settings: {
        type: Boolean,
        default: true
    }
});

const userStore = useUserStore();

const computedLetter = computed(() => {
    return props.userLetter?.charAt(0).toUpperCase() || userStore.user?.displayName?.charAt(0).toUpperCase() || '';
});
</script>

<template>
    <div @click="props.settings ? goTo('/settings') : null" class="flex items-center justify-center text-white rounded-full font-semibold" :class="[`size-${props.size}`, props.orange ? 'bg-orange-600' : 'bg-libelo-500']">{{ computedLetter }}</div>
</template>
