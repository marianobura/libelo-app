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
        async fetchSubject(subjectId, force = false) {
            if (!force && this.subject && this.subject._id === subjectId) {
                return;
            }

            this.loading = true;
            try {
                const apiUrl = new URL(`/api/subjects/${subjectId}`, process.env.VUE_APP_API_URL);
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