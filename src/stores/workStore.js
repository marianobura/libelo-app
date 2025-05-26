import { defineStore } from 'pinia';

export const useWorkStore = defineStore('workStore', {
    state: () => ({
        worksByClassroom: {}
    }),
    actions: {
        setWorks(classroomId, pending, completed) {
            this.worksByClassroom[classroomId] = {
                pending,
                completed,
                loaded: true
            };
        },
        getWorks(classroomId) {
            return this.worksByClassroom[classroomId] || { pending: [], completed: [], loaded: false };
        },
        clear() {
            this.worksByClassroom = {};
        }
    }
});
