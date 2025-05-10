<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
    document.body.classList.add('overflow-hidden')
})

onUnmounted(() => {
    document.body.classList.remove('overflow-hidden')
})
</script>

<template>
    <div class="fixed inset-0 flex bg-black/20 z-50">
        <slot />
    </div>
</template>
