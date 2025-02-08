<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { SendHorizontalIcon } from 'lucide-vue-next';

const props = defineProps({
    modelValue: String,
    isSending: Boolean,
});

const emit = defineEmits(['update:modelValue', 'sendMessage']);

const textarea = ref(null);

const onInput = (event) => {
    emit('update:modelValue', event.target.value);
    autoResize();
};

const autoResize = () => {
    if (textarea.value) {
        textarea.value.style.height = "auto";
        textarea.value.style.height = textarea.value.scrollHeight + "px";
    }
};

const sendMessage = () => {
    if (!props.isSending) {
        emit('sendMessage', resetTextareaHeight);
    }
};

const resetTextareaHeight = () => {
    if (textarea.value) {
        textarea.value.style.height = "24px";
    }
};

onMounted(() => {
    autoResize();
});
</script>


<template>
    <div class="flex items-center gap-3 bg-white rounded-xl max-h-32 w-full p-2 outline outline-none has-[textarea:focus-within]:outline has-[textarea:focus-within]:outline-2 has-[textarea:focus-within]:-outline-offset-2 has-[textarea:focus-within]:outline-libelo-500">
        <textarea ref="textarea" :value="props.modelValue" @input="onInput" class="w-full max-h-28 text-black pl-1 focus:outline-none" placeholder="Escribe un mensaje..." rows="1" />
        <div @click="sendMessage" :disabled="props.isSending" :class="props.isSending ? 'bg-libelo-700' : 'bg-libelo-500'" class="flex items-center justify-center size-10 rounded-xl flex-shrink-0 text-white mb-auto">
            <SendHorizontalIcon :size="20" />
        </div>
    </div>
</template>