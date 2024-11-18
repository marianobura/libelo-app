import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export const useSubjectData = () => {
    const subjectData = ref(null);
    const route = useRoute();

    const fetchSubjectData = async () => {
        try {
        const apiUrl = new URL(`/api/subjects`, process.env.VUE_APP_API_URL);
        const response = await axios.get(apiUrl.toString());
        const subjects = response.data.data;
        subjectData.value = subjects.find(subject => subject._id === route.params.id);
        } catch (error) {
        console.error("Error al obtener la información de la materia:", error);
        }
    };

    return {
        subjectData,
        fetchSubjectData
    };
};
