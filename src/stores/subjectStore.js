import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./userStore";

export const useSubjectStore = defineStore("subjectStore", {
    state: () => ({
        subject: null,
        subjects: [],
        subjectsLoaded: false,
        loading: false,
    }),

    getters: {
        getSubjectData: (state) => {
            return state.subject;
        },
        getSubjects: (state) => {
            return state.subjects;
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

        async fetchSubjects() {
            if (this.subjectsLoaded) return;

            const userStore = useUserStore();

            this.loading = true;
            try {
                const apiUrl = new URL(`/api/subjects?studentId=${userStore.user._id}`, process.env.VUE_APP_API_URL);
                const response = await axios.get(apiUrl.toString());
                this.subjects = response.data.data;
                this.subjectsLoaded = true;
            } catch (error) {
                console.error("Error al obtener las materias:", error);
            } finally {
                this.loading = false;
            }
        },

        updateSubject(updatedSubject) {
            const index = this.subjects.findIndex(s => s._id === updatedSubject._id);
            if (index !== -1) {
                this.subjects[index] = { ...this.subjects[index], ...updatedSubject };
            }
        },

        addSubject(newSubject) {
            this.subjects.push(newSubject);
        },

        removeSubject(subjectId) {
            this.subjects = this.subjects.filter(subject => subject._id !== subjectId);
        }
    }
});