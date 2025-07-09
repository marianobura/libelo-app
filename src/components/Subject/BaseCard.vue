<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: String,
    description: String,
    chat: Boolean,
    icon: Function,
    linkTo: String,
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <component
        :is="!props.disabled && props.linkTo ? 'router-link' : 'div'"
        :to="!props.disabled ? props.linkTo : null"
        class="flex flex-col gap-2 p-3 rounded-xl text-neutral-700 transition duration-200 h-full"
        :class="[
            props.chat ? 'bg-gradient-to-b from-[#D8D8D8] to-[#CECECE]' : 'border border-neutral-300',
            props.disabled ? 'opacity-60 cursor-not-allowed bg-neutral-300 relative' : 'hover:bg-neutral-200',
        ]">
        <span v-if="props.disabled" class="absolute top-0 left-0 text-sm ml-14 mt-4 font-semibold">Próximamente</span>
        <component :is="props.icon" :size="28" class="text-libelo-500" />
        <p class="text-sm line-clamp-2 break-">{{ props.description }}</p>
    </component>
</template>