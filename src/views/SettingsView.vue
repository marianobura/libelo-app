<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import LabelTitle from "@/components/Settings/LabelTitle.vue";
import BaseItem from "@/components/Settings/BaseItem.vue";
import { UserRoundPen, SquareAsterisk, LayoutDashboard } from "lucide-vue-next";

const SHORTCUTS = {
    profile: {
        label: "Perfil",
        items: [
            { title: "Editar perfil", icon: UserRoundPen },
            { title: "Cambiar contraseña", icon: SquareAsterisk },
            { title: "Google Classroom", icon: LayoutDashboard },
        ],
    },
}
</script>

<template>
    <BaseBody>
        <BaseNav title="Configuración" />
        <div class="flex flex-col gap-4 p-2">
            <template v-for="(category, key) in SHORTCUTS" :key="key">
                <LabelTitle :label="category.label">
                    <template v-for="(item, index) in category.items" :key="index">
                        <BaseItem :title="item.title" :icon="item.icon" />
                    </template>
                </LabelTitle>
            </template>
        </div>
    </BaseBody>
</template>