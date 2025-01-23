import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "welcome",
        component: () => import("@/views/WelcomeView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/student",
        name: "student-home",
        component: () => import("@/views/student/HomeView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/teacher",
        name: "teacher-home",
        component: () => import("@/views/teacher/HomeView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id",
        name: "subject",
        component: () => import("@/views/student/SubjectView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/chat/fast",
        name: "fast-chat",
        component: () => import("@/views/student/FastChatView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/work",
        name: "work",
        component: () => import("@/views/student/WorkView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/calendar",
        name: "calendar",
        component: () => import("@/views/student/CalendarView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import("@/views/SettingsView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/edit-profile",
        name: "edit-profile",
        component: () => import("@/views/EditProfileView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/change-password",
        name: "change-password",
        component: () => import("@/views/ChangePasswordView.vue"),
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
