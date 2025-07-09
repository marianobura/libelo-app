<script setup>
import UserAvatar from '@/components/UserAvatar.vue';
import LibeloIsologo from '@/assets/LibeloIsologo.vue';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { Coins, Bell } from 'lucide-vue-next';

const userStore = useUserStore();

const userLetter = computed(() => {
    return userStore.user?.displayName?.charAt(0) || '';
});
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div class="w-10 text-libelo-500">
            <LibeloIsologo />
        </div>
        <div class="flex gap-2 items-center">
            <router-link to="/notifications"
                class="flex items-center justify-center size-10 bg-gray-100 rounded-full hover:bg-neutral-200">
                <div class="relative">
                    <Bell size="20" stroke-width="2" />
                    <span v-if="true"
                        class="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
                </div>
            </router-link>
            <router-link v-if="userStore.user?.role === 'teacher'" to="/teacher/promotions"
                class="flex items-center justify-center size-10 bg-gray-100 rounded-full hover:bg-neutral-200">
                <Coins size="20" stroke-width="2" />
            </router-link>
            <UserAvatar :user-letter="userLetter" size="10" />
        </div>
    </div>
</template>