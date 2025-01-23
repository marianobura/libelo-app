<script setup>
import HomeNav from "@/components/Home/HomeNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
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
