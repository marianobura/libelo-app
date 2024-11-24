<script setup>
import { defineProps } from 'vue';

defineProps({
    sign: {
        type: Boolean,
    }
});
</script>

<template>
    <div class="bg-body" :class="sign ? 'flex flex-col justify-between gap-2 p-2 flex-grow' : 'grid grid-rows-body min-h-full'">
        <slot />
    </div>
</template>
