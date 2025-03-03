<script setup>
import { ArrowUpRight } from 'lucide-vue-next';
import { defineProps } from 'vue'

defineProps({
    title: String,
    description: String,
    link: {
        type: Boolean,
    }
})
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-col">
            <div v-if="link" class="flex gap-2" :class="link ? 'items-center' : ''">
                <h2 class="text-lg font-semibold">{{ title }}</h2>
                <router-link to="/settings/favorite-subjects" class="flex items-center justify-center px-2 gap-1 bg-neutral-200 rounded-full text-libelo-500 font-semibold">
                    <span class="text-sm">Editar</span>
                    <ArrowUpRight size="16" />
                </router-link>
            </div>
            <h2 v-else class="text-lg font-semibold">{{ title }}</h2>
            <p class="text-sm text-neutral-700">{{ description }}</p>
        </div>
        <slot />
    </div>
</template>