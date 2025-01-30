import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useSubjectStore = defineStore("subjectStore", () => {
    const subjectData = ref(null);
    const loading = ref(false);

    async function fetchSubject(subjectId) {
        if (subjectData.value && subjectData.value._id === subjectId) {
            return;
        }

        loading.value = true;
        try {
            const apiUrl = new URL(`/api/subjects`, process.env.VUE_APP_API_URL);
            const response = await axios.get(apiUrl.toString());
            const subjects = response.data.data;
            subjectData.value = subjects.find(subject => subject._id === subjectId);
        } catch (error) {
            console.error("Error al obtener la información de la materia:", error);
        } finally {
            loading.value = false;
        }
    }

    return { subjectData, fetchSubject, loading };
});
