<script setup>
import NavModal from './Navbar/NavModal.vue';
import { ArrowLeft, EllipsisVertical } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { defineProps, ref } from 'vue';

const showModal = ref(false);

defineProps({
    title: String
});

const router = useRouter();
const goBack = () => router.back();
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div @click="goBack" class="size-10 flex items-center justify-center rounded-xl hover:bg-neutral-100">
            <ArrowLeft :size="20" />
        </div>
        <div class="font-semibold text-lg">{{ title }}</div>
        <div id="show-modal" @click="showModal = true" class="size-10 flex items-center justify-center rounded-xl hover:bg-neutral-100">
            <EllipsisVertical :size="20" />
        </div>

        <NavModal :show-modal="showModal" @close="showModal = false" />
    </div>
</template>