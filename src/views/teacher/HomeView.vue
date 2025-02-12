<script setup>
import HomeNav from "@/components/Home/HomeNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import HomeCard from "@/components/Home/HomeCard.vue";
import { useUserStore } from '@/stores/userStore';
import { onMounted, computed } from "vue";
import { goTo } from "@/router";
import { LoaderCircle } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";

const userStore = useUserStore();

const subjects = computed(() => userStore.user?.preferredSubjects ?? []);

onMounted(async () => {
    await userStore.fetchUser();
});
</script>

<template>
    <BaseBody>
        <HomeNav />
        <div class="flex flex-col gap-4 p-2">
            <HomeHeader />
			<BaseTitle title="Materias favoritas" description="Selecciona una materia para acceder a una lista con los chats de los estudiantes y ayudarlos con sus dudas. ">
                <div v-if="loading" class="mt-12 flex items-center justify-center w-full h-full text-libelo-500">
                    <div class="animate-spin">
                        <LoaderCircle :size="32" />
                    </div>
                    <div class="ml-2">
                        <p class="font-semibold">Cargando...</p>
                    </div>
                </div>
                <div v-else-if="subjects.length === 0" class="flex flex-col items-center justify-center gap-2 w-full bg-neutral-200 border border-neutral-300 font-semibold p-2 rounded-xl">
                    <span>Todavía no tienes ninguna materia favorita.</span>
                    <BaseButton @click="goTo('/settings/favorite-subjects')" primary>Agrega tu primera materia</BaseButton>
                </div>
                <div v-else class="grid grid-cols-2 gap-2 w-full text-white font-semibold">
                    <HomeCard v-for="(subject, index) in subjects" :key="index" @click="goTo(`/teacher/subject/${index}`)" :content=subject />
                </div>
            </BaseTitle>
		</div>
    </BaseBody>
</template>
