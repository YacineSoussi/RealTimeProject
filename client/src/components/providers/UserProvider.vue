<template>
	<slot :logout="logout" :isAuth="isAuth"></slot>
</template>

<script setup>
import { ref, provide, watchEffect } from "vue";
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

const register = () => {
	return UserLogic.updateUser(id, body).then((data) => {
		User.status = data.status;
		return data;
	});
};

let isAuth = ref(AuthLogic.isAuth());

watchEffect(async () => {
	users.value = await UserLogic.getUsers();
});

const updateUser = (id, body) => {
	return UserLogic.updateUser(id, body).then((data) => {
		User.status = data.status;
		return data;
	});
};

provide("ProviderLogout", logout);
provide("ProviderIsAuth", isAuth);
provide("ProviderLogin", login);
provide("ProviderRegister", register);
provide("ProviderUpdateUser", updateUser);
provide("ProviderUsers", users);
</script>
