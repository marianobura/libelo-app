import { ref, watch } from "vue";

export const newMessageEvent = ref(null);

export const notifyNewMessage = (message) => {
  newMessageEvent.value = message;
};

// Notificaciones del navegador para cualquier vista
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

watch(newMessageEvent, (newMessage) => {
  if (newMessage) {
    new Notification("Nuevo mensaje", {
      body: `${newMessage.sender.displayName} te ha respondido.`,
      icon: "/path-to-chat-icon.png", // Personaliza según tu app
    });
  }
});
