import { defineStore } from "pinia";
import axios from "axios";

export const useChatStore = defineStore("chatStore", {
    state: () => ({
        messages: [],
        userMessage: "",
        loading: false,
        isSending: false,
    }),

    getters: {
        isChatEmpty: (state) => state.messages.length === 0,

        getMessages: (state) => state.messages,
    },

    actions: {
        async fetchChatMessages(subjectId) {
            if (!subjectId) return;

            this.messages = [];
            this.loading = true;
            try {
                const apiUrl = new URL(`/api/chats/${subjectId}`, process.env.VUE_APP_API_URL);
                const response = await axios.get(apiUrl.toString());

                if (response.data?.data?.messages) {
                    this.messages = response.data.data.messages.map((message) => ({
                        sender: message.sender,
                        text: message.message,
                    }));
                }
            } catch (error) {
                console.error("Error al obtener los mensajes:", error);
            } finally {
                this.loading = false;
            }
        },

        async sendMessage(userMessage, user, subjectId, subjectName, resetTextareaHeight) {
            if (this.isSending || !userMessage.trim() || !subjectId) return;

            this.isSending = true;

            const newMessage = {
                subjectName,
                subjectId,
                studentId: user.role === "student" ? user._id : null,
                teacherId: user.role === "teacher" ? user._id : null,
                message: userMessage,
                sender: user._id,
            };

            try {
                const apiUrl = new URL(`/api/chats/${subjectId}`, process.env.VUE_APP_API_URL);
                await axios.post(apiUrl.toString(), newMessage);

                this.messages.push({
                    sender: {
                        _id: user._id,
                        role: user.role,
                        displayName: user.displayName,
                    },
                    text: userMessage,
                });

                this.userMessage = "";
                resetTextareaHeight();
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
            } finally {
                this.isSending = false;
            }
        },
    },
});
