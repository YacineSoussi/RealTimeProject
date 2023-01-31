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
	<section class="global">
		<div class="block">
			<div class="block__title">
				<h1 class="block__title-text">Connexion</h1>
			</div>
			<div class="block__content">
				<form class="form" @submit.prevent="onSubmit()">
					<div class="form__group">
						<label class="form__label" for="email">Adresse mail</label>
						<input
							class="form__input"
							type="email"
							id="email"
							placeholder="Adresse mail"
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
								placeholder="Mot de passe"
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
	</section>
</template>

<style scoped>
.block {
	width: 100%;
	max-width: 40%;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

@media (min-width: 1100px) {
	.block {
		max-width: 500px;
	}
}

@media (max-width: 700px) {
	.block {
		max-width: 55%;
	}
}

@media (max-width: 500px) {
	.block {
		max-width: 70%;
	}
}

@media (max-width: 375px) {
	.block {
		max-width: 90%;
	}
}

.global {
	display: flex;
	justify-content: center;
	align-items: center;
}

.block__title-text {
	font-size: 2rem;
	font-weight: bold;
	margin-bottom: 20px;
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
