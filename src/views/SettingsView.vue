<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import LabelTitle from "@/components/Settings/LabelTitle.vue";
import BaseItem from "@/components/Settings/BaseItem.vue";
import { UserRoundPen, SquareAsterisk, LayoutDashboard } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import { goTo } from "@/router";
import { ref } from "vue";

const router = useRouter();
const loading = ref(false);

const SHORTCUTS = {
    profile: {
        label: "Perfil",
        items: [
            { title: "Editar perfil", icon: UserRoundPen, route: "/settings/edit-profile" },
            { title: "Cambiar contraseña", icon: SquareAsterisk, route: "/settings/change-password" },
            { title: "Google Classroom", icon: LayoutDashboard, route: "/settings/google-classroom" },
        ],
    },
}

const logout = () => {
    loading.value = true;

    setTimeout(() => {
        localStorage.removeItem("token");
        router.push({ path: "/welcome" });
        loading.value = false;
    }, 2000);
}
</script>

<template>
    <BaseBody>
        <BaseNav title="Configuración" />
        <div class="flex flex-col gap-2 p-2">
            <template v-for="(category, key) in SHORTCUTS" :key="key">
                <LabelTitle :label="category.label">
                    <template v-for="(item, index) in category.items" :key="index">
                        <BaseItem :title="item.title" :icon="item.icon" @click="goTo(item.route)"  />
                    </template>
                </LabelTitle>
            </template>
            <BaseButton @click="logout" logout>{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</BaseButton>
        </div>
    </BaseBody>
</template>