<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import LabelTitle from "@/components/Settings/LabelTitle.vue";
import BaseItem from "@/components/Settings/BaseItem.vue";
import { UserRoundPen, SquareAsterisk, LayoutDashboard, BookHeart, TicketCheck } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import { goTo } from "@/router";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { googleLogout } from "vue3-google-login";

const router = useRouter();
const loading = ref(false);
const userStore = useUserStore();

const logout = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push({ path: "/" });
}
</script>

<template>
    <BaseBody>
        <BaseNav title="Configuración" />
        <div class="flex flex-col gap-2 p-2">
            <LabelTitle label="Perfil">
                <BaseItem title="Editar perfil" :icon="UserRoundPen" @click="goTo('/settings/edit-profile')" />
                <BaseItem v-if="userStore.user.password" title="Cambiar contraseña" :icon="SquareAsterisk" @click="goTo('/settings/change-password')" />
                <BaseItem v-if="userStore.user.role === 'student'" title="Google" :icon="LayoutDashboard" @click="goTo('/settings/google')" />
            </LabelTitle>
            <LabelTitle v-if="userStore.user.role === 'teacher'" label="Materias">
                <BaseItem title="Materias favoritas" :icon="BookHeart" @click="goTo('/settings/favorite-subjects')" />
            </LabelTitle>
            <LabelTitle v-if="userStore.user.role === 'teacher'" label="Promociones">
                <BaseItem title="Canjeadas" :icon="TicketCheck" @click="goTo('/settings/promotions')" />
            </LabelTitle>
            <BaseButton @click="logout" danger>{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</BaseButton>
        </div>
    </BaseBody>
</template>