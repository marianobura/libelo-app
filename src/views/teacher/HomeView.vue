<script setup>
import HomeNav from "@/components/Home/HomeNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from '@/stores/userStore';
import HomeHeader from "@/components/Home/HomeHeader.vue";

const userStore = useUserStore();
const loading = ref(true);

onMounted(async () => {
    await userStore.fetchUser();
    loading.value = false;
});
</script>

<template>
    <BaseBody>
        <HomeNav />
        <div class="flex flex-col gap-4 p-2">
            <HomeHeader />
			<p>home profesor</p>
		</div>
    </BaseBody>
</template>
