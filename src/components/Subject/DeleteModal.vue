<script setup>
import { defineProps, defineEmits, ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { TriangleAlert } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import { goTo } from "@/router";
import axios from "axios";

const route = useRoute();
const path = route.params.id;
const loading = ref(false);

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};

const deleteSubject = async () => {
    loading.value = true;
    try {
        const apiUrl = new URL(`/api/subjects/${path}`, process.env.VUE_APP_API_URL);
        await axios.delete(apiUrl.toString());
        goTo("/student");
    } catch (error) {
        console.error("Error al eliminar la materia:", error);
    } finally {
        closeModal();
        loading.value = false;
    }
};
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @close="closeModal">
        <div class="w-full m-2 rounded-xl overflow-hidden">
            <div class="flex gap-4 bg-white p-4">
                <div class="size-12 flex items-center justify-center bg-red-500/20 rounded-full text-red-500 flex-shrink-0">
                    <TriangleAlert size="24" />
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold">Eliminar materia</p>
                    <p class="text-sm text-neutral-700">Esta acción no tiene vuelta atrás. Al eliminar la materia, se perderán todos los datos asociados a ella.</p>
                </div>
            </div>
            <div class="bg-neutral-100 p-4">
                <div class="flex justify-end gap-2">
                    <BaseButton @click="closeModal">Cancelar</BaseButton>
                    <BaseButton danger @click="deleteSubject">{{ loading ? 'Eliminando...' : 'Eliminar' }}</BaseButton>
                </div>
            </div>
        </div>
    </BaseModal>
</template>