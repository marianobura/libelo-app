<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from '@/components/BaseTitle.vue'
import SubjectBanner from '@/components/SubjectBanner.vue'
</script>

<template>
    <BaseBody>
        <BaseNav title="Calendario" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Revisa tus próximas fechas" description="Consulta, organiza y planifica tus próximas fechas de forma simple y eficiente en un solo lugar.">
                <iframe 
                    src="https://calendar.google.com/calendar/embed?src=11e395b11c75f744b50b8474b7105d5e84bbcee94f3dcff80e1fe8d4699bf68a@group.calendar.google.com" 
                    style="border: 0" 
                    width="auto" 
                    height="400" 
                    frameborder="0" 
                    scrolling="no">
                </iframe>
            </BaseTitle>
        </div> 
    </BaseBody>
</template>