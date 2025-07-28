<script setup>
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { defineProps, defineEmits } from "vue";
import BaseTitle from "@/components/BaseTitle.vue";

const props = defineProps({
    showModal: Boolean,
    promotion: Object,
    error: String
});

const emit = defineEmits(["close", "redeem"]);

const closeModal = () => {
    emit("close");
};

const redeem = () => {
    emit("redeem");
};
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @close="closeModal">
        <div class="bg-white rounded-xl w-full h-fit mx-2 overflow-hidden p-4">
            <BaseTitle title="Canjear promoción" :description="`¿Estás seguro de que deseas canjear esta promoción por ${promotion.points} puntos?`" />
            <p v-if="props.error" class="text-red-500 text-sm font-semibold mt-2">{{ props.error }}</p>
            <div class="flex justify-end mt-4 gap-2">
                <BaseButton @click="closeModal" danger>Cancelar</BaseButton>
                <BaseButton @click="redeem" primary>Canjear</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
