<script setup>
import { defineProps, defineEmits } from "vue";
import { ref, computed } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "../BaseButton.vue";
import { Angry, Frown, Laugh, Meh, Smile } from "lucide-vue-next";
import axios from "axios";
import { useChatStore } from "@/stores/chatStore";
import { watch } from "vue";

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};

const chatStore = useChatStore();
const hasRated = computed(() => chatStore.chatInfo?.rated !== null);
const rating = ref(chatStore.chatInfo?.rated ?? 3);

watch(() => chatStore.chatInfo?.rated, (newVal) => {
    if (newVal !== null && newVal !== undefined) {
        rating.value = newVal;
    }
});

const RateTeacher = async () => {
    try {
        const apiUrl = new URL(`/api/chats/rate-teacher`, process.env.VUE_APP_API_URL);
        await axios.post(apiUrl.toString(), {
            subjectId: chatStore.chatInfo?.subjectId,
            rating: rating.value,
        });

        chatStore.chatInfo.rated = rating.value;
    } catch (error) {
        console.error("Error al actualizar los puntos:", error);
    } finally {
        closeModal();
    }
};
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @close="closeModal">
        <div class="bg-white rounded-xl w-full h-fit mx-2 overflow-hidden">
            <div :class="['relative w-full h-28', rating === 1 ? 'bg-rose-600' : rating === 2 ? 'bg-amber-600' : rating === 3 ? 'bg-yellow-500' : rating === 4 ? 'bg-lime-600' : rating === 5 ? 'bg-libelo-500' : 'bg-yellow-500']">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 aspect-square w-fit h-auto bg-white rounded-full">
                    <div class="flex justify-center items-center size-28">
                        <Angry v-if="rating === 1" :size="96" :stroke-width="1.5" class="text-rose-600" />
                        <Frown v-else-if="rating === 2" :size="96" :stroke-width="1.5" class="text-amber-600" />
                        <Meh v-else-if="rating === 3" :size="96" :stroke-width="1.5" class="text-yellow-500" />
                        <Smile v-else-if="rating === 4" :size="96" :stroke-width="1.5" class="text-lime-600" />
                        <Laugh v-else :size="96" :stroke-width="1.5" class="text-libelo-500" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-4 p-4" :class="chatStore.chatInfo.rated ? 'mt-8' : 'mt-12'">
                <template v-if="!hasRated">
                    <h2 class="text-lg font-semibold text-center text-balance">¿Cómo calificarías la atención del profesor?</h2>
                    <div class="flex justify-center gap-4">
                        <template v-for="num in 5" :key="num">
                            <label>
                                <input type="radio" :value="num" v-model="rating" class="peer hidden" />
                                <div class="size-10 flex items-center justify-center rounded-full border-2 border-libelo-500 text-libelo-500 font-semibold peer-checked:bg-libelo-500 peer-checked:text-white cursor-pointer transition">{{ num }}</div>
                            </label>
                        </template>
                    </div>
                    <BaseButton primary class="mt-4" @click="RateTeacher">Enviar calificación</BaseButton>
                </template>
                <template v-else>
                    <p class="text-center font-semibold mt-4">Gracias por tu valoración. Has calificado al profesor con <span :class="rating === 1 ? 'text-rose-600' : rating === 2 ? 'text-amber-600' : rating === 3 ? 'text-yellow-500' : rating === 4 ? 'text-lime-600' : rating === 5 ? 'text-libelo-500' : 'text-yellow-500'">{{ chatStore.chatInfo.rated }}</span> estrella{{ chatStore.chatInfo.rated > 1 ? 's' : '' }}.</p>
                </template>
            </div>
        </div>
    </BaseModal>
</template>