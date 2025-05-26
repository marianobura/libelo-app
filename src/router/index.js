import { createRouter, createWebHistory } from "vue-router";

const routes = [
    // General
    {
        path: "/",
        name: "welcome",
        component: () => import("@/views/auth/WelcomeView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/auth/LoginView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/auth/RegisterView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/choose-role",
        name: "choose-role",
        component: () => import("@/views/auth/ChooseRoleView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/notifications",
        name: "notifications",
        component: () => import("@/views/NotificationsView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import("@/views/settings/SettingsView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/edit-profile",
        name: "edit-profile",
        component: () => import("@/views/settings/EditProfileView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/change-password",
        name: "change-password",
        component: () => import("@/views/settings/ChangePasswordView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/reset-password",
        name: "reset-password",
        component: () => import("@/views/auth/ResetPasswordView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/settings/favorite-subjects",
        name: "favorite-subjects",
        component: () => import("@/views/settings/FavoriteSubjectsView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/google",
        name: "google-settings",
        component: () => import("@/views/settings/GoogleSettingsView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/chat",
        name: "chat",
        component: () => import("@/views/ChatView.vue"),
        meta: { requiresAuth: true },
    },

    // Estudiante
    {
        path: "/student",
        name: "student-home",
        component: () => import("@/views/student/HomeView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/student/subject/:id",
        name: "student-subject",
        component: () => import("@/views/student/SubjectView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/student/subject/:id/chat/fast",
        name: "student-fast-chat",
        component: () => import("@/views/student/FastChatView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/student/subject/:id/objectives",
        name: "student-objectives",
        component: () => import("@/views/student/ObjectivesView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/student/subject/:id/work",
        name: "student-work",
        component: () => import("@/views/student/WorkView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/student/subject/:id/calendar",
        name: "student-calendar",
        component: () => import("@/views/student/CalendarView.vue"),
        meta: { requiresAuth: true },
    },

    // Profesor
    {
        path: "/teacher",
        name: "teacher-home",
        component: () => import("@/views/teacher/HomeView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/teacher/subject/:id",
        name: "teacher-subject",
        component: () => import("@/views/teacher/SubjectView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/teacher/promotions",
        name: "teacher-promotions",
        component: () => import("@/views/teacher/PromotionsListView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/teacher/promotions/:id",
        name: "teacher-promotion",
        component: () => import("@/views/teacher/PromotionView.vue"),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (to.meta.requiresAuth && !token) {
        next({ name: "welcome" });
    } else if (!to.meta.requiresAuth && token) {
        if (role === 'student') {
            next({ name: 'student-home' });
        } else if (role === 'teacher') {
            next({ name: 'teacher-home' });
        } else {
            next({ name: 'choose-role' });
        }
    } else {
        next();
    }
});

const goTo = (path) => {
    router.push(path);
};

export { goTo };
export default router;
