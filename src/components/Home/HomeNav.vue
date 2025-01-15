<script setup>
import UserAvatar from '@/components/UserAvatar.vue';
// import { Bell } from 'lucide-vue-next';
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div>
            <img src="/img/logo.png" alt="Logo de Libelo" class="h-8">
        </div>
        <div class="flex gap-2 items-center">
            <!-- <div class="flex items-center justify-center size-10 bg-gray-100 rounded-full">
                <Bell :size="20" />
            </div> -->
            <UserAvatar size="10" />
        </div>
    </div>
</template>