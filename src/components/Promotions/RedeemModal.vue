<script setup>
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { defineProps, defineEmits } from "vue";
import BaseTitle from "@/components/BaseTitle.vue";
import { computed } from "vue";
import { goTo } from "@/router";

const props = defineProps({
    showModal: Boolean,
    promotion: Object,
    error: String,
    promotionRedeem: Boolean,
    loading: Boolean,
});

const emit = defineEmits(["close", "redeem"]);

const closeModal = () => {
    emit("close");
};

const redeem = () => {
    if (props.loading) return;
    emit("redeem");
};

const code = computed(() => props.promotion.code ? props.promotion.code.split("") : []);
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @close="closeModal">
        <div class="bg-white rounded-xl w-full h-fit mx-2 overflow-hidden p-4">
            <template v-if="!props.promotionRedeem">
                <BaseTitle title="Canjear promoción" :description="`¿Estás seguro de que deseas canjear esta promoción por ${props.promotion.points} puntos?`" />
                <p v-if="props.error" class="text-red-500 text-sm font-semibold mt-2">{{ props.error }}</p>
                <div class="flex justify-end mt-4 gap-2">
                    <BaseButton @click="closeModal" danger>Cancelar</BaseButton>
                    <BaseButton @click="redeem" primary>{{ props.loading ? 'Canjeando...' : 'Canjear' }}</BaseButton>
                </div>
            </template>
            <template v-else>
                <BaseTitle title="Promoción canjeada" description="¡Has canjeado la promoción exitosamente! Utiliza esta promoción en un local disponible y disfrútala al máximo con el siguiente código:">
                    <div class="flex justify-between">
                        <span v-for="(char, index) in code" :key="index" class="flex items-center justify-center bg-libelo-50 rounded-md size-8 text-libelo-500 font-semibold">{{ char }}</span>
                    </div>
                </BaseTitle>
                <div class="flex flex-col gap-2 mt-4">
                    <BaseButton @click="goTo('/settings/promotions')" secondary>Promociones canjeadas</BaseButton>
                    <BaseButton @click="closeModal" primary>Continuar</BaseButton>
                </div>
            </template>
        </div>
    </BaseModal>
</template>
