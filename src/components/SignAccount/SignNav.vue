<script setup>
import { defineProps } from 'vue';
import LibeloImagotipo from '@/assets/LibeloImagotipo.vue'
import { ArrowLeft } from 'lucide-vue-next';
import { goTo } from '@/router';

defineProps({
    title: String,
});
</script>

<template>
    <div class="flex flex-col bg-libelo-500">
        <div class="flex items-center justify-center w-full h-24">
            <div class="w-40 text-white">
                <LibeloImagotipo />
            </div>
        </div>
        <div class="grid grid-cols-[40px_1fr_40px] p-2 items-center gap-4 bg-body rounded-t-xl border-b border-neutral-300">
            <div @click="goTo('/')" class="size-10 flex items-center justify-center rounded-xl border border-neutral-300 hover:bg-neutral-200">
                <ArrowLeft :size="20" />
            </div>
            <h1 class="font-semibold text-2xl text-center">{{ title }}</h1>
        </div>
    </div>
</template>