<script setup>
import { defineProps } from "vue";
import UserAvatar from "../UserAvatar.vue";

const props = defineProps({
    student: Object,
    linkTo: String,
});
</script>

<template>
    <router-link :to="props.linkTo" class="flex items-center justify-between gap-8 w-full p-2 odd:bg-neutral-300 even:bg-neutral-200">
        <div class="flex gap-2 items-center max-w-[70%]">
            <div>
                <UserAvatar :userLetter="props.student.name.charAt(0)" :size="'10'" />
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
