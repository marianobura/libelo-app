import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/welcome",
        name: "welcome",
        component: () => import("../views/WelcomeView.vue"),
        meta: { requiresAuth: false, guestOnly: true },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
        meta: { requiresAuth: false, guestOnly: true },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/RegisterView.vue"),
        meta: { requiresAuth: false, guestOnly: true },
    },
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id",
        name: "subject",
        component: () => import("../views/SubjectView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/chat/fast",
        name: "fast-chat",
        component: () => import("../views/FastChatView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/work",
        name: "work",
        component: () => import("../views/WorkView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subject/:id/calendar",
        name: "calendar",
        component: () => import("../views/CalendarView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import("../views/SettingsView.vue"),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

const goTo = (path) => {
    router.push(path);
};

export { goTo };
export default router;
