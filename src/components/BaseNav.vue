<script setup>
import OptionsModal from './Navbar/OptionsModal.vue';
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

        <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <OptionsModal :show-modal="showModal" @close="showModal = false" />
        </Transition>
    </div>
</template>