<script setup>
import NavModal from './Navbar/NavModal.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { defineProps, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserAvatar from './UserAvatar.vue';
import { computed } from 'vue';

const userStore = useUserStore();
const showModal = ref(false);

defineProps({
    title: String
});

const router = useRouter();
const goBack = () => router.back();

const userLetter = computed(() => {
    return userStore.user?.displayName?.charAt(0) || '';
});
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div @click="goBack" class="size-10 flex items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-100">
            <ArrowLeft :size="20" />
        </div>
        <div class="font-semibold text-lg">{{ title }}</div>
        <!-- `<div id="show-modal" @click="showModal = true" class="size-10 flex items-center justify-center rounded-xl hover:bg-neutral-100">
            <EllipsisVertical :size="20" />
        </div>` -->
        <UserAvatar :user-letter="userLetter" size="10" />

        <NavModal :show-modal="showModal" @close="showModal = false" />
    </div>
</template>