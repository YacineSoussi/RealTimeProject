import { createRouter, createWebHistory } from "vue-router";

import { initialFetchConversations } from "../stores/ConversationStore";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/HomeView.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("../views/auth/LoginView.vue"),
		},
		{
			path: "/register",
			name: "register",
			component: () => import("../views/auth/RegisterView.vue"),
		},
		{
			path: "/conversation",
			name: "conversation",
			component: () => import("../views/tchats/GlobalView.vue"),
			beforeEnter: [initialFetchConversations],
			meta: { requiresAuth: true },
		},
		{
			path: "/chatbot",
			name: "chatbot",
			component: () => import("../views/chatbot/ChatbotView.vue"),
		},
		{
			path: "/help",
			name: "help",
			component: () => import("../views/HelpView.vue"),
			meta: { requiresAuth: true },
		},
		{
			path: "/admin/dashboard",
			name: "admin-dashboard",
			component: () => import("../views/admin/DashboardView.vue"),
			beforeEnter: [initialFetchConversations],
			meta: { requiresAuth: true },
		},
	],
});

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem("app-user");
	if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
		next({ name: "login" });
	} else {
		next();
	}
});

export default router;
