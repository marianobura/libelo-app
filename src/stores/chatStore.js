import { defineStore } from "pinia";
import axios from "axios";
import socket from "@/services/socket";

export const useChatStore = defineStore("chatStore", {
    state: () => ({
        messages: [],
        chatInfo: null,
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

                if (response.data?.data) {
                    const chat = response.data.data;
        
                    this.chatInfo = {
                        _id: chat._id,
                        subjectName: chat.subjectName,
                        subjectId: chat.subjectId,
                        studentId: chat.studentId,
                        teacherId: chat.teacherId,
                        rated: chat.rated,
                    };
        
                    this.messages = chat.messages.map((message) => ({
                        sender: message.sender,
                        text: message.message,
                    }));

                    socket.emit("joinRoom", this.chatInfo.subjectId);
                }
            } catch (error) {
                console.error("Error al obtener los mensajes:", error);
            } finally {
                this.loading = false;
            }
        },

        async sendMessage(userMessage, user, subjectId, subjectName) {
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

                this.userMessage = ""
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
            } finally {
                this.isSending = false;
            }
        },

        listenForIncomingMessages() {
            socket.on("newMessage", (message) => {
                const alreadyExists = this.messages.some((m) =>
                    m.sender._id === message.sender._id &&
                    m.text === message.text
                );

                if (!alreadyExists) {
                    this.messages.push(message);
                }
            });
        },

        listenForTeacherAssignment() {
            socket.on("teacherAssigned", (newTeacherId) => {
                if (this.chatInfo) {
                    this.chatInfo.teacherId = newTeacherId;
                }
            });                       
        },
    },
});
