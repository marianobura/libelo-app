<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import StudentCard from "@/components/Subject/StudentCard.vue";
import { User } from "lucide-vue-next";
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Alumnos que te solicitaron" description="Estos son los alumnos que te solicitaron como mentor.">
                <div class="w-full flex flex-col bg-neutral-300 rounded-xl overflow-hidden">
                    <div class="flex items-center gap-2 pb-2 border-b border-neutral-400 m-2 mb-0">
                        <User :size="20"/>
                        <p class="font-semibold">Selecciona un alumno</p>
                    </div>
                    <div class="flex flex-col w-full">
                        <StudentCard />
                        <StudentCard />
                        <StudentCard />
                    </div>
                </div>
            </BaseTitle>
        </div>
    </BaseBody>
</template>