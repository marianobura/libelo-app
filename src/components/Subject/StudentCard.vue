<script setup>
import { defineProps } from "vue";
import UserAvatar from "../UserAvatar.vue";

const props = defineProps({
    student: Object,
    linkTo: String,
    color: String,
});
</script>

<template>
    <router-link :to="props.linkTo" class="flex items-center justify-between gap-8 w-full p-2">
        <div class="flex gap-2 items-center max-w-[70%]">
            <div class="relative">
                <UserAvatar :user-letter="props.student.name.charAt(0).toUpperCase()" size="10" />
                <div class="absolute top-0">
                    <div class="w-3 h-3 rounded-full" :class="`bg-${props.color}-500`"></div>
                </div>
            </div>
            <div class="flex flex-col">
                <p class="font-semibold text-sm break-all line-clamp-1">{{ props.student.name }}</p>
                <p class="text-neutral-600 text-sm break-all line-clamp-1">{{ props.student.message }}</p>
            </div>
        </div>
        <div class="flex flex-col">
            <p class="text-sm">{{ props.student.date }}</p>
            <p class="text-sm">{{ props.student.hour }} hs</p>
        </div>
    </router-link>
</template>
