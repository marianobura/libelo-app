<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import EmptyState from '@/components/EmptyState.vue';
import { MailPlus } from 'lucide-vue-next';

const notifications = [
    {
        id: 1,
        title: '¡Nuevo mensaje!',
        description: 'Has recibido un nuevo mensaje de Juan Pérez.',
        date: 'Hace 5 minutos',
        read: false,
    }
];
</script>

<template>
    <BaseBody>
        <BaseNav title="Notificaciones" />
        <div class="h-full p-2" :class="notifications.length === 0 ? 'flex items-center' : ''">
            <EmptyState v-if="notifications.length === 0" title="Todavía no hay notificaciones" description="Las notificaciones aparecerán aquí una vez que las hayas recibido." icon="BellOff" />
            <div v-if="notifications.length > 0" class="flex flex-col gap-2">
                <div v-for="notification in notifications" :key="notification.id" class="bg-white rounded-lg p-4 flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-libelo-500 font-semibold">
                        <MailPlus :size="24" />
                        <span>{{ notification.title }}</span>
                    </div>
                    <div class="flex flex-col">
                        <div class="text-sm">{{ notification.description }}</div>
                        <div class="flex items-center gap-2 text-gray-500">
                            <span v-if="!notification.read" class="text-xs text-red-500">No leído</span>
                            <span>-</span>
                            <span class="text-xs">{{ notification.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseBody>
</template>