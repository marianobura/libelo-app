<script setup>
import { watch, defineProps, onBeforeUnmount, useAttrs } from 'vue';

const props = defineProps({
    show: Boolean,
    animation: {
        type: String,
        default: 'fade'
    }
});

const attrs = useAttrs();

watch(
    () => props.show,
    (visible) => {
        if (visible) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    document.body.classList.remove('overflow-hidden');
});
</script>

<template>
    <teleport to="body">
        <div v-if="props.show" class="fixed bg-black/0 z-50">
            <div class="relative">
                <div class="absolute h-screen w-screen bg-black/20 z-60 bottom-0 left-0"></div>
                    <transition :name="props.animation" appear>
                        <div class="fixed inset-0 flex bg-black/0 z-50" v-bind="attrs">
                            <slot />
                        </div>
                    </transition>
                </div>
            </div>
    </teleport>
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
