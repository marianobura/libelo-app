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
import { signOut } from "firebase/auth";
import { auth } from "services/firebase";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

const router = useRouter();
const loading = ref(false);
const userStore = useUserStore();
const subjectOptions = ref([]);

const deleteSubject = async () => {
    const subjectToDelete = userStore?.user?.class;

    if (!subjectToDelete) {
        console.error("No se encontró la clase del usuario.");
        return;
    }

    console.log("Eliminando clase:", subjectToDelete);

    try {
        const apiUrl = new URL(`/api/subjects/${subjectToDelete._id}`, process.env.VUE_APP_API_URL);
        await axios.delete(apiUrl.toString());

        subjectOptions.value = subjectOptions.value.filter(subject => subject._id !== subjectToDelete._id);
    } catch (error) {
        console.error("Error al eliminar la clase:", error);
    }
};

const SHORTCUTS = {
    profile: {
        label: "Perfil",
        items: [
            { title: "Cambiar nombre de la clase", icon: UserRoundPen },
            { title: "Eliminar clase", icon: SquareAsterisk, action: deleteSubject }, // Eliminar sin modal
            { title: "Google Classroom", icon: LayoutDashboard, route: "/settings/google-classroom" },
        ],
    },
    subjects: {
        label: "Materias",
        items: [
            { title: "Materias favoritas", icon: BookHeart, route: "/settings/favorite-subjects" },
        ]
    }
};


const logout = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push({ path: "/" });
    loading.value = false;
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Configuración" />
        <div class="flex flex-col gap-2 p-2">
            <template v-for="(category, key) in SHORTCUTS" :key="key">
                <LabelTitle v-if="key !== 'subjects' || userStore?.user?.role === 'teacher'" :label="category.label">
                    <template v-for="(item, index) in category.items" :key="index">
                        <BaseItem 
                            :title="item.title" 
                            :icon="item.icon" 
                            @click="item.action ? item.action() : goTo(item.route)"  
                        />
                    </template>
                </LabelTitle>
            </template>
            <BaseButton @click="logout" logout>{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</BaseButton>
        </div>
    </BaseBody>
</template>
