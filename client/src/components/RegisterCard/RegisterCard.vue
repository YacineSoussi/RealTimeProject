<script setup>
import { ref, reactive, computed, inject } from "vue";
import router from "../../router";
import { RouterLink } from "vue-router";

const isLoading = ref(false);
const showPassword = ref(false);
const redirectToLogin = () => router.push({ name: "login" });
const typePassword = computed(() => (showPassword.value ? "text" : "password"));
const register = inject("ProviderRegister");
const errorMsg = ref("");

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

const isPassword = () => {
	const password = form.password;

	if (password.length < 8) {
		errors.password = "Le mot de passe doit contenir au moins 8 caractères";
	} else {
		errors.password = "";
	}
};

const isFirstName = () => {
	const firstName = form.firstName;

	if (firstName.length < 2) {
		errors.firstName = "Le prénom doit contenir au moins 2 caractères";
	} else {
		errors.firstName = "";
	}
};

const isLastName = () => {
	const lastName = form.lastName;

	if (lastName.length < 2) {
		errors.lastName = "Le nom doit contenir au moins 2 caractères";
	} else {
		errors.lastName = "";
	}
};

const isEmail = () => {
	const re = /\S+@\S+\.\S+/;
	const email = form.email;

	if (!re.test(email)) {
		errors.email = "L'adresse mail est invalide";
	} else {
		errors.email = "";
	}
};

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

const isValidForm = computed(() => {
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
					<div class="form__group">
						<label class="form__label" for="firstName">Prénom</label>
						<input
							class="form__input"
							type="text"
							id="firstName"
							placeholder="Prénom"
							v-model="form.firstName"
							@input="isFirstName"
						/>
						<p class="messageErrors m-2" v-if="errors?.firstName">
							{{ errors.firstName }}
						</p>
					</div>
					<div class="form__group">
						<label class="form__label" for="lastName">Nom</label>
						<input
							class="form__input"
							type="text"
							placeholder="Nom"
							id="lastName"
							v-model="form.lastName"
							@input="isLastName"
						/>
						<p class="messageErrors m-2" v-if="errors?.lastName">
							{{ errors.lastName }}
						</p>
					</div>
					<div class="form__group">
						<label class="form__label" for="email">Adresse mail</label>
						<input
							class="form__input"
							type="email"
							placeholder="Adresse mail"
							id="email"
							v-model="form.email"
							@input="isEmail"
						/>
						<p class="messageErrors m-2 ml-0" v-if="errors?.email">
							{{ errors.email }}
						</p>
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
							<p class="messageErrors m-2 ml-0" v-if="errors?.password">
								{{ errors.password }}
							</p>
						</div>
					</div>
					<p class="messageErrors m-2 ml-0" v-if="errorMsg">
						{{ errorMsg }}
					</p>
					<RouterLink to="/login" class="form__link">
						Déjà inscrit ?
					</RouterLink>
					<div class="form__group mt-2">
						<button
							class="form__button"
							:style="isValidForm"
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

.ml-0 {
	margin-left: 0;
}

@media (min-width: 1850px) {
	.block {
		max-width: 500px;
	}
}

@media (max-width: 1250px) {
	.block {
		max-width: 35%;
	}
}

@media (max-width: 1000px) {
	.block {
		max-width: 45%;
	}
}

@media (max-width: 800px) {
	.block {
		max-width: 55%;
	}
}

@media (max-width: 600px) {
	.block {
		max-width: 75%;
	}
}

@media (max-width: 400px) {
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
	background: #ccc !important;
	cursor: pointer;
}

.messageErrors {
	color: red;
}

.mt-10 {
	margin-top: 10px;
}
</style>
