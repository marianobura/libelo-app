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

const isTeacher = computed(() => {
    return userStore.user?.role === 'teacher'; 
});
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div class="w-10 text-libelo-500">
            <LibeloIsologo />
        </div>
        <div class="flex gap-2 items-center">
            <Bell color="#083DB2" size="27" class="mr-4"/>
            <router-link v-if="isTeacher" to="/teacher/points" class="flex items-center gap-2 mr-4">
                <Coins color="#083DB2" size="28" />
            </router-link>
            <UserAvatar :user-letter="userLetter" size="10" />
        </div>
    </div>
</template>
