<script setup>
import HomeNav from "@/components/Home/HomeNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import HomeCard from "@/components/Home/HomeCard.vue";
import { useUserStore } from '@/stores/userStore';
import { onMounted } from "vue";
import { goTo } from "@/router";

const userStore = useUserStore();

onMounted(async () => {
    await userStore.fetchUser();
});
</script>

<template>
    <BaseBody>
        <HomeNav />
        <div class="flex flex-col gap-4 p-2">
            <HomeHeader />
			<BaseTitle title="Tus herramientas" description="Accede a tus chats, consulta puntos y gestiona tus actividades en un solo lugar.">
                <div class="grid grid-cols-1 gap-2 w-full text-white font-semibold">
                    <HomeCard @click="goTo(`/teacher/subject`)" content="Chat con estudiantes" />
                </div>
            </BaseTitle>
		</div>
    </BaseBody>
</template>
