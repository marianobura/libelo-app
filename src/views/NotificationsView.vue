<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import EmptyState from '@/components/EmptyState.vue';
import { MailPlus } from 'lucide-vue-next';
import { onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);

onMounted(async () => {
    await userStore.fetchUser();
    if (userStore.user?._id) {
        await notificationStore.fetchNotifications(userStore.user._id);
    }
});
</script>


<template>
    <BaseBody>
        <BaseNav title="Notificaciones" />
        <div class="h-full p-2" :class="notifications.length === 0 ? 'flex items-center' : ''">
            <EmptyState v-if="notifications.length === 0" title="Todavía no hay notificaciones" description="Las notificaciones aparecerán aquí una vez que las hayas recibido." icon="BellOff" />
            <div v-else class="flex flex-col gap-2">
                <div v-for="notification in notifications" :key="notification._id"
                    class="bg-white rounded-xl p-4 flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-libelo-500 font-semibold">
                        <MailPlus :size="24" />
                        <span>{{ notification.type === 'chat' ? 'Has recibido un nuevo mensaje' : 'Notificación' }}</span>
                    </div>
                    <div class="flex flex-col">
                        <div class="text-sm">
                            {{ notification.content?.message ? `"${notification.content.message}"` : notification.description || 'Tienes una nueva notificación' }}
                        </div>
                        <div class="flex items-center gap-2 text-gray-500">
                            <span v-if="!notification.read" class="text-xs text-red-500">No leído</span>
                            <span>-</span>
                            <span class="text-xs">{{ new Date(notification.createdAt).toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseBody>
</template>