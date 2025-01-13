import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/welcome",
        name: "welcome",
        component: () => import("../views/WelcomeView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/RegisterView.vue"),
        meta: { requiresAuth: false },
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
    {
        path: "/settings/edit-profile",
        name: "edit-profile",
        component: () => import("../views/EditProfileView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/settings/change-password",
        name: "change-password",
        component: () => import("../views/ChangePasswordView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/recover-password",
        name: "recover-password",
        component: () => import("../views/PasswordRecover.vue"),
        meta: { requiresAuth: false },
    }
    
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem("token");

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: "welcome" });
    } else if (!to.meta.requiresAuth && isAuthenticated) {
        next({ name: "home" });
    } else {
        next();
    }
});

const goTo = (path) => {
    router.push(path);
};

export { goTo };
export default router;