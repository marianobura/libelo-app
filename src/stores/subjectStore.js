import { defineStore } from "pinia";
import axios from "axios";

export const useSubjectStore = defineStore("subjectStore", {
    state: () => ({
        subject: null,
        loading: false,
    }),

    getters: {
        isSubjectLoaded: (state) => {
            return !!state.subject;
        },

        getSubjectData: (state) => {
            return state.subject;
        },
    },

    actions: {
        async fetchSubject(subjectId) {
            if (this.subject && this.subject._id === subjectId) {
                return;
            }

            this.loading = true;
            try {
                const apiUrl = `${process.env.VUE_APP_API_URL}/api/subjects/${subjectId}`;
                const response = await axios.get(apiUrl.toString());
                this.subject = response.data.data;
            } catch (error) {
                console.error("Error al obtener la información de la materia:", error);
            } finally {
                this.loading = false;
            }
        },
    }
});