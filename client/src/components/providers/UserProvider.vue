<!-- Gestion des données de l'application -->
<template>
	<slot :logout="logout" :isAuth="isAuth"></slot>
</template>

<script setup>
import { ref, reactive, provide, watchEffect } from "vue";
import AuthLogic from "../../logics/AuthLogic";
import router from "../../router";
import UserLogic from "../../logics/UserLogic";
import LocalStorage from "../../services/LocalStorage";

const User = LocalStorage.get("user");
const users = ref([]);

const login = (form) => {
	return AuthLogic.login({ ...form }).then((data) => {
		isAuth.value = !isAuth.value;
		user.value = data;
	});
};

const logout = () => {
	AuthLogic.logout();
	isAuth.value = !isAuth.value;
	router.push({ name: "home" });
};

const register = (form) => {
	return AuthLogic.register({ ...form });
};
const updateUser = (id, body) => {
	return UserLogic.updateUser(id, body).then((data) => {
		User.status = data.status;
		return data;
	});
};

let isAuth = ref(AuthLogic.isAuth());
const user = reactive({});

watchEffect(async () => {
	if (isAuth.value) {
		users.value = await UserLogic.getUsers();
	}
});

provide("Providerlogout", logout);
provide("ProviderisAuth", isAuth);
provide("ProviderLogin", login);
provide("ProviderRegister", register);
provide("ProviderUpdateUser", updateUser);
provide("ProviderUsers", users);
</script>
