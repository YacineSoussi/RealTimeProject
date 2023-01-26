<script setup>
import { ref, reactive, computed, inject } from "vue";
import router from "../../router";
import { RouterLink } from "vue-router";

const isLoading = ref(false);
const showPassword = ref(false);
const error = ref("");
const form = reactive({
	email: "",
	password: "",
});
const login = inject("ProviderLogin");

const redirectToHome = () => {
	router.push({ name: "home" });
};

const typePassword = computed(() => {
	return showPassword.value ? "text" : "password";
});

const onSubmit = async () => {
	isLoading.value = true;
	try {
		await login(form);
		redirectToHome();
	} catch (err) {
		error.value = err.message;
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<div class="global p-5">
		<div class="block p-5">
			<div class="block__title">
				<h1 class="block__title-text">Se connecter</h1>
			</div>
			<div class="block__content">
				<form class="form" @submit.prevent="onSubmit()">
					<div class="form__group">
						<label class="form__label" for="email">Adresse mail</label>
						<input
							class="form__input"
							type="email"
							id="email"
							v-model="form.email"
						/>
					</div>
					<div class="form__group">
						<label class="form__label" for="password">Mot de passe</label>
						<div class="form__input-group">
							<input
								class="form__input"
								:type="typePassword"
								id="password"
								v-model="form.password"
							/>
							<button
								class="form__input-button"
								type="button"
								@click="showPassword = !showPassword"
							>
								<font-awesome-icon icon="eye" />
							</button>
						</div>
					</div>
					<div class="errors">
						<div class="error messageErrors m-2" v-if="error">
							<li>{{ error }}</li>
						</div>
					</div>
					<RouterLink to="/register" class="form__link"
						>Pas encore inscrit ?</RouterLink
					>
					<div class="form__group mt-10">
						<button class="form__button" type="submit" :disabled="isLoading">
							<span v-if="isLoading">Chargement...</span>
							<span v-else>Se connecter</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
.block {
	width: 100%;
	max-width: 20%;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.global {
	display: flex;
	justify-content: center;
	align-items: center;
}

.form__group {
	margin-bottom: 20px;
}

.form__input-group {
	position: relative;
}

.form__input {
	width: 100%;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.form__input-button {
	position: absolute;
	top: 0;
	right: 0;
	padding: 10px;
	border: none;
	background: none;
	cursor: pointer;
}

.form__button {
	width: 100%;
	padding: 10px;
	border: none;
	border-radius: 5px;
	background: #ccc;
	cursor: pointer;
}

.messageErrors {
	color: red;
}

.mt-10 {
	margin-top: 10px;
}
</style>
