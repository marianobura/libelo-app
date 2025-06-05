<script setup>
/* eslint-disable */
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { defineProps, onMounted } from 'vue';
import UserAvatar from './UserAvatar.vue';
import { useUserStore } from '@/stores/userStore';
import LibeloIsologo from '@/assets/LibeloIsologo.vue';
import { Coins, Bell } from 'lucide-vue-next';

const userStore = useUserStore();

defineProps({
    title: String,
    home: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();
const goBack = () => router.back();

onMounted(() => {
    console.log("Componente montado");
});
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div v-if="home" class="w-10 text-libelo-500">
            <LibeloIsologo />
        </div>
        <div v-else @click="goBack" class="size-10 flex items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-100">
            <ArrowLeft :size="20" />
        </div>
        <div v-if="home" class="flex gap-2 items-center">
            <router-link to="/notifications" class="flex items-center justify-center size-10 bg-gray-100 rounded-full hover:bg-neutral-200">
                <Bell size="20" stroke-width="2" />
            </router-link>
            <router-link v-if="userStore.user?.role === 'teacher'" to="/teacher/promotions" class="flex items-center justify-center size-10 bg-gray-100 rounded-full hover:bg-neutral-200">
                <Coins size="20" stroke-width="2" />
            </router-link>
            <UserAvatar size="10" />
        </div>
        <div v-else class="font-semibold text-lg">{{ title }}</div>
        <UserAvatar v-if="!home" size="10" />
    </div>
</template>