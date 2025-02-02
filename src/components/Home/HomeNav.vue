<script setup>
import UserAvatar from '@/components/UserAvatar.vue';
import LibeloIsologo from '@/assets/LibeloIsologo.vue'
// import { Bell } from 'lucide-vue-next';
</script>

<template>
    <div class="flex justify-between items-center px-2 bg-white border-b border-gray-300">
        <div class="w-10 text-libelo-500">
            <LibeloIsologo />
        </div>
        <div class="flex gap-2 items-center">
            <!-- <div class="flex items-center justify-center size-10 bg-gray-100 rounded-full">
                <Bell :size="20" />
            </div> -->
            <UserAvatar size="10" />
        </div>
    </div>
</template>