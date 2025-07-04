<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
    content: String,
    color: String,
    banner: String
});

const gradientStyle = computed(() => ({
    backgroundImage: `linear-gradient(to bottom, ${props.color})`
}));

const bannerStyle = computed(() => ({
    backgroundImage: `url(${props.banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right',
    opacity: 0.1,
    filter: 'grayscale(100%)',
}));

function getContrastingTextColor(bgColor) {
    if (!bgColor) return "white";
    const colors = bgColor.split(",");
    const hex = colors[0].trim();
    const hexValue = hex.replace("#", "");
    if (hexValue.length !== 6) return "white";

    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? "black" : "white";
}

const textColor = computed(() => {
    const color = props.color;
    return getContrastingTextColor(color);
});
</script>

<template>
    <div class="relative w-full h-20 rounded-xl overflow-hidden cursor-pointer">
        <div class="absolute inset-0" :style="gradientStyle" />
        <div v-if="banner" class="absolute inset-0" :style="bannerStyle" />
        <div class="relative z-10 flex items-center justify-center h-full p-4 uppercase">
            <div class="line-clamp-2 text-center break-words" :style="{ color: textColor }">{{ content }}</div>
        </div>
    </div>
</template>
