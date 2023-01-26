<script setup>
import { ref, reactive, computed, inject } from "vue";
import router from "../../router";
import { RouterLink } from "vue-router";

const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
	email: "",
	password: "",
	firstName: "",
	lastName: "",
});

const errors = reactive({
	email: "",
	password: "",
	firstName: "",
	lastName: "",
});

const errorMsg = ref("");

const isPassword = () => {
	const password = form.password;
	if (password.length < 8) {
		errors.password = "Password must be at least height characters";
	} else {
		errors.password = "";
	}
};

const isEmail = () => {
	const re = /\S+@\S+\.\S+/;
	const email = form.email;

	if (!re.test(email)) {
		errors.email = "Email is invalid";
	} else {
		errors.email = "";
	}
};

const register = inject("ProviderRegister");

const onSubmit = async () => {
	isLoading.value = true;

	try {
		await register(form);
		redirectToLogin();
	} catch (err) {
		errorMsg.value = err.message;
	} finally {
		isLoading.value = false;
	}
};

const redirectToLogin = () => {
	router.push({ name: "login" });
};

const typePassword = computed(() => (showPassword.value ? "text" : "password"));

const isValid = computed(() => {
	if (
		errors.email === "" &&
		errors.firstName === "" &&
		errors.lastName === "" &&
		errors.password === "" &&
		form.email !== "" &&
		form.firstName !== "" &&
		form.lastName !== "" &&
		form.password !== ""
	) {
		return false;
	} else {
		return true;
	}
});

const isValidStyle = computed(() => {
	if (isValid.value === true) {
		return {
			cursor: "not-allowed",
			backgroundColor: "#e0e0e0",
		};
	}
});
</script>

<template>
	<div class="global p-5">
		<div class="block p-5">
			<div class="block__title">
				<h1 class="block__title-text">S'inscrire</h1>
			</div>
			<div class="block__content">
				<form class="form" @submit.prevent="onSubmit">
					<div class="form__group flex">
						<div class="m-2">
							<label class="form__label" for="firstName">Prénom</label>
							<input
								class="form__input"
								type="text"
								id="firstName"
								v-model="form.firstName"
								@blur="isFirstName"
							/>
							<p class="form__error" v-if="errors.firstName">
								{{ errors.firstName }}
							</p>
						</div>
						<div class="m-2">
							<label class="form__label" for="lastName">Nom</label>
							<input
								class="form__input"
								type="text"
								id="lastName"
								v-model="form.lastName"
								@blur="isLastName"
							/>
							<p class="form__error" v-if="errors.lastName">
								{{ errors.lastName }}
							</p>
						</div>
					</div>

					<div class="form__group">
						<label class="form__label" for="email">Adresse mail</label>
						<input
							class="form__input"
							type="email"
							id="email"
							v-model="form.email"
							@input="isEmail"
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
								@input="isPassword"
							/>
							<button
								class="form__input-button"
								:class="errors ? 'red' : null"
								type="button"
								@click="showPassword = !showPassword"
							>
								<font-awesome-icon icon="eye" />
							</button>
						</div>
					</div>
					<div class="errors">
						<div class="error messageErrors m-2" v-if="errors.email">
							<li>{{ errors.email }}</li>
						</div>
						<div class="error messageErrors m-2" v-if="errors.password">
							<li>{{ errors.password }}</li>
						</div>
					</div>
					<div class="error messageErrors m-2" v-if="errorMsg">
						<li>{{ errorMsg }}</li>
					</div>
					<RouterLink to="/login" class="form__link">
						Déjà inscrit ?
					</RouterLink>
					<div class="form__group">
						<button
							class="form__button mt-10"
							:style="isValidStyle"
							type="submit"
							:disabled="isValid"
						>
							<span v-if="isLoading">Chargement...</span>
							<span v-else>S'inscrire</span>
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
	max-width: 30%;
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
	background: rgb(11, 11, 11);
	cursor: pointer;
	color: #fff;
}

.messageErrors {
	color: red;
}

.mt-10 {
	margin-top: 10px;
}
</style>
