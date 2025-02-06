<script setup>
import { defineProps, defineEmits } from 'vue';
import { SendHorizontalIcon } from 'lucide-vue-next';

const props = defineProps({
    modelValue: String,
    isSending: Boolean,
});

const emit = defineEmits(['update:modelValue', 'sendMessage']);

const onInput = (event) => {
    emit('update:modelValue', event.target.value);
};

const sendMessage = () => {
    if (!props.isSending) {
        emit('sendMessage');
    }
};
</script>


<template>
    <div class="flex items-center gap-3 bg-white rounded-full w-full h-14 p-2 outline outline-none has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-libelo-500">
        <div class="bg-blue-950 h-full w-full">
            <input :value="props.modelValue" @input="onInput" type="text" class="w-full h-full text-black pl-2 focus:outline-none" placeholder="Escribe un mensaje..." />
        </div>
        <div @click="sendMessage" :disabled="props.isSending" :class="props.isSending ? 'bg-libelo-700' : 'bg-libelo-500'" class="flex items-center justify-center size-10 rounded-full flex-shrink-0 text-white">
            <SendHorizontalIcon :size="20" />
        </div>
    </div>
</template>