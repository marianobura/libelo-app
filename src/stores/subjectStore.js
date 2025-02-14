import { defineStore } from "pinia";
import axios from "axios";

export const useSubjectStore = defineStore("subjectStore", {
    state: () => ({
        subjectData: null,
        loading: false,
    }),

    getters: {
        isSubjectLoaded: (state) => {
            return !!state.subjectData;
        },

        getSubjectData: (state) => {
            return state.subjectData;
        },
    },

    actions: {
        async fetchSubject(subjectId) {
            if (this.subjectData && this.subjectData._id === subjectId) {
                return;
            }

            this.loading = true;
            try {
                const apiUrl = new URL(`/api/subjects/${subjectId}`, process.env.VUE_APP_API_URL);
                const response = await axios.get(apiUrl.toString());
                this.subjectData = response.data.data;
            } catch (error) {
                console.error("Error al obtener la información de la materia:", error);
            } finally {
                this.loading = false;
            }
        },
    }
});