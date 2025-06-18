<script setup>
import { onMounted, onUnmounted, defineProps } from 'vue';

const props = defineProps({
    show: Boolean,
    animation: {
        type: String,
        default: 'fade'
    }
});

onMounted(() => {
    document.body.classList.add('overflow-hidden');
});

onUnmounted(() => {
    document.body.classList.remove('overflow-hidden');
});
</script>

<template>
    <transition :name="props.animation">
        <div v-if="props.show" class="fixed inset-0 flex bg-black/20 z-50">
            <slot />
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}
</style>
