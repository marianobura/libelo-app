<script setup>
import HomeNav from "@/components/Home/HomeNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import HomeCard from "@/components/Home/HomeCard.vue";
import { useUserStore } from '@/stores/userStore';
import { onMounted, computed } from "vue";
import { goTo } from "@/router";

const userStore = useUserStore();

const subjects = userStore.user?.preferredSubjects;

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
                <div class="grid grid-cols-2 gap-2 w-full text-white font-semibold">
                    <HomeCard v-for="(subject, index) in subjects" :key="index" @click="goTo(`/teacher/subject/${index}`)" :content=subject />
                </div>
            </BaseTitle>
		</div>
    </BaseBody>
</template>
