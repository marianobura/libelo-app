<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import EmptyState from '@/components/EmptyState.vue';

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
            <div v-if="notifications.length > 0">
                a
            </div>
        </div>
    </BaseBody>
</template>