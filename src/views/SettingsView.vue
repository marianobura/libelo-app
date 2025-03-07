<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import LabelTitle from "@/components/Settings/LabelTitle.vue";
import BaseItem from "@/components/Settings/BaseItem.vue";
import { UserRoundPen, SquareAsterisk, LayoutDashboard, BookHeart } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import { goTo } from "@/router";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { googleLogout } from "vue3-google-login";

const router = useRouter();
const loading = ref(false);
const userStore = useUserStore();

const SHORTCUTS = {
    profile: {
        label: "Perfil",
        items: [
            { title: "Editar perfil", icon: UserRoundPen, route: "/settings/edit-profile" },
            { title: "Cambiar contraseña", icon: SquareAsterisk, route: "/settings/change-password" },
            { title: "Google Classroom", icon: LayoutDashboard, route: "/settings/google-classroom" },
        ],
    },
    subjects: {
        label: "Materias",
        items: [
            { title: "Materias favoritas", icon: BookHeart, route: "/settings/favorite-subjects" },
        ]
    }
}

const logout = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push({ path: "/" });
    loading.value = false;
}
</script>

<template>
    <BaseBody>
        <BaseNav title="Configuración" />
        <div class="flex flex-col gap-2 p-2">
            <template v-for="(category, key) in SHORTCUTS" :key="key">
                <LabelTitle v-if="key !== 'subjects' || userStore?.user?.role === 'teacher'" :label="category.label">
                    <template v-for="(item, index) in category.items" :key="index">
                        <BaseItem :title="item.title" :icon="item.icon" @click="goTo(item.route)"  />
                    </template>
                </LabelTitle>
            </template>
            <BaseButton @click="logout" danger>{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</BaseButton>
        </div>
    </BaseBody>
</template>