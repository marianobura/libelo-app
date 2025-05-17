<script setup>
import { defineProps } from 'vue'
import { goTo } from '@/router';

const props = defineProps({
    primary: {
        type: Boolean,
        default: false
    },
    path: {
        type: String,
        default: null
    },
    action: {
        type: Function,
        default: null
    },
    danger: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const handleClick = () => {
    if (props.disabled) return;
    if (props.action) {
        props.action();
    } else if (props.path) {
        goTo(props.path);
    }
};
</script>

<template>
    <button @click="handleClick"
        :disabled="props.disabled"
        class="w-full h-12 rounded-xl font-semibold"
        :class="{
            'bg-libelo-500 text-white hover:bg-libelo-600': props.primary && !props.danger,
            'bg-neutral-200 text-black border border-neutral-300 hover:bg-neutral-300': !props.primary && !props.danger,
            'bg-red-700 text-white hover:bg-red-800': props.danger,
            'bg-libelo-500 opacity-60 cursor-not-allowed': props.disabled && props.primary,
        }">
        <slot />
    </button>
</template>